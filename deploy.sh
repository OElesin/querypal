#!/bin/bash

nflag=false
pflag=false
rflag=false
eflag=false
tflag=false


DIRNAME=$(pwd)

usage () { echo "
    -h -- Opens up this help message
    -n -- Name of the CloudFormation stack
    -p -- Name of the AWS profile to use
    -r -- AWS Region to use
    -e -- Name of the environment
    -t -- SSM Parameter key containing GitHub Access Token
"; }
options=':n:p:r:e:dh'
while getopts $options option
do
    case "$option" in
        n  ) nflag=true; STACK_NAME=$OPTARG;;
        p  ) pflag=true; PROFILE=$OPTARG;;
        r  ) rflag=true; REGION=$OPTARG;;
        e  ) eflag=true; ENV=$OPTARG;;
        t  ) tflag=true; GITHUB_TOKEN=$OPTARG;;
        h  ) usage; exit;;
        \? ) echo "Unknown option: -$OPTARG" >&2; exit 1;;
        :  ) echo "Missing option argument for -$OPTARG" >&2; exit 1;;
        *  ) echo "Unimplemented option: -$OPTARG" >&2; exit 1;;
    esac
done

if ! $pflag
then
    echo "-p not specified, using default..." >&2
    PROFILE="default"
fi
if ! $nflag
then
    STACK_NAME="querypal-web-ui"
fi
if ! $rflag
then
    echo "-r not specified, using default region..." >&2
    REGION=$(aws configure get region --profile $PROFILE)
fi
if ! $eflag
then
    echo "-e not specified, using master..." >&2
    ENV="master"
fi
if ! $tflag
then
    echo "-e not specified, using dev..." >&2
    GITHUB_TOKEN="/Querypal/Amplify/GitHubToken"
fi

echo "Deploying Querypal Amplify App Stack"
aws cloudformation deploy --stack-name ${STACK_NAME} \
  --profile $PROFILE \
  --region $REGION \
  --stack-name $STACK_NAME \
  --template-file cloudformation/templates/querypal-amplify-app.yaml \
  --parameters \
    ParameterKey=pEnv,ParameterValue=$ENV \
    ParameterKey=pGitHubAccessToken,ParameterValue=$GITHUB_TOKEN \
  --capabilities "CAPABILITY_NAMED_IAM" \
  --no-fail-on-empty-changeset

echo "Starting initial Amplify job ..."
APP_ID=$(sed -e 's/^"//' -e 's/"$//' <<<"$(aws ssm get-parameter --profile $PROFILE --region "$REGION" --name /Querypal/Amplify/AppID --query "Parameter.Value")")
aws amplify start-job --profile $PROFILE --region "$REGION" --app-id "$APP_ID" --branch-name $ENV --job-type RELEASE

until [[ $(aws amplify get-job --profile $PROFILE --region "$REGION" --app-id "$APP_ID" --branch-name $ENV --job-id 1 --query 'job.summary.status' --output text) = *"RUNNING"* ]];
do
  echo "Amplify console job is running......"
  sleep 60s
  if [[ $(aws amplify get-job --profile $PROFILE --region "$REGION" --app-id "$APP_ID" --branch-name $ENV --job-id 1 --query 'job.summary.status' --output text) != "RUNNING" ]]; then
    echo "Amplify console job Finished"
    status=$(aws amplify get-job --profile $PROFILE --region "$REGION" --app-id "$APP_ID" --branch-name $ENV --job-id 1 --query 'job.summary.status' --output text)
    if [ "$status" == "SUCCEED" ]
    then
        echo "JOB $status"
    else
        echo "JOB $status"
        exit 1;
    fi
    break
  fi
done

