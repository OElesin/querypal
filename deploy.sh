#!/bin/bash
set -eux

nflag=false
pflag=false
rflag=false
eflag=false
tflag=false
aflag=false
bflag=false


DIRNAME=$(pwd)

usage () { echo "
    -h -- Opens up this help message
    -n -- Name of the CloudFormation stack
    -p -- Name of the AWS profile to use
    -r -- AWS Region to use
    -e -- Name of the environment
    -t -- SSM Parameter key containing GitHub Access Token
    -a -- Querypal AWS Amplify App name
    -b -- S3 Bucket Name to upload SAM Artifacts
"; }
options=':n:p:r:e:t:a:dhb:'
while getopts $options option
do
    case "$option" in
        n  ) nflag=true; STACK_NAME=$OPTARG;;
        p  ) pflag=true; PROFILE=$OPTARG;;
        r  ) rflag=true; REGION=$OPTARG;;
        e  ) eflag=true; ENV=$OPTARG;;
        t  ) tflag=true; GITHUB_TOKEN=$OPTARG;;
        a  ) aflag=true; QUERYPAL_AMPLIFY_NAME=$OPTARG;;
        b  ) bflag=true; S3_SAM_BUCKET=$OPTARG;;
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
    echo "-t not specified, GitHub Token Cannot be an empty string" >&2
    exit 255
fi
if ! $aflag
then
    echo "-a not specified, using querypal..." >&2
    QUERYPAL_AMPLIFY_NAME="querypal"
fi
if ! $bflag
then
    echo "-b not specified, using generating a random s3 name" >&2
    S3_SAM_BUCKET=$(openssl rand -hex 20)
    aws s3 mb "s3://${S3_SAM_BUCKET}"
fi


echo "Deploying Querypal Amplify App Stack"
sam build --template cloudformation/querypal-amplify-app.yaml --build-dir build --use-container --build-image Function1=amazon/aws-sam-cli-build-image-python3.8

sam deploy --stack-name ${STACK_NAME} \
  --profile $PROFILE \
  --region $REGION \
  --stack-name $STACK_NAME \
  --s3-bucket $S3_SAM_BUCKET\
  --template-file build/template.yaml \
  --parameter-overrides pEnv=$ENV pGitHubAccessToken=$GITHUB_TOKEN pQuerypalAppName=$QUERYPAL_AMPLIFY_NAME \
  --capabilities "CAPABILITY_NAMED_IAM" \
  --no-fail-on-empty-changeset

