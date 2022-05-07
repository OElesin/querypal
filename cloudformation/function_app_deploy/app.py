from crhelper import CfnResource
import logging
import boto3
from botocore import exceptions

logger = logging.getLogger(__name__)
client = boto3.client('amplify')

helper = CfnResource(json_logging=False, log_level='DEBUG', boto_level='CRITICAL', sleep_on_delete=120, ssl_verify=None)


def check_deploy_job(app_id, branch_name, job_id=1):
    """
    Function to check if Querypal app exists
    :return:
    """
    try:
        response = client.get_job(
            appId=app_id,
            branchName=branch_name,
            jobId=job_id
        )
        job_run_status = response['job']['summary']['status']
        return job_run_status
    except exceptions.ClientError as error:
        logger.info(error)
        return False


@helper.poll_create
def poll_create(event, context):
    """
    Function to create and start the amplify build
    aws amplify start-job --profile $PROFILE --region "$REGION" --app-id "$APP_ID" --branch-name $ENV --job-type RELEASE
    :param event:
    :param context:
    :return:
    """
    logger.info("Got Create")
    app_id = event['ResourceProperties']['AmplifyAppId']
    branch_name = event['ResourceProperties']['BranchName']
    data = event['CrHelperData']
    job_id = data.get('DeployJobId', '1')
    deploy_job_status = check_deploy_job(app_id, branch_name, job_id)
    if not deploy_job_status:
        response = client.start_job(
            appId=app_id,
            branchName=branch_name,
            jobType='RELEASE'
        )
        job_id = response['jobSummary']['jobId']
        helper.Data.update({'DeployJobId': job_id})
    elif deploy_job_status in ['FAILED', 'CANCELLED']:
        # --app-id "$APP_ID" --branch-name $ENV --job-id 1 --query 'job.summary.status' --output text
        raise ValueError(f"Amplify App {app_id} failed to build. Check Amplify console for more details")
    elif deploy_job_status in ['PENDING', 'PROVISIONING', 'RUNNING', 'CANCELLING']:
        return None
    else:
        return True


@helper.delete
def delete(event, context):
    logger.info("Got Delete")


@helper.update
def update(event, context):
    logger.info("Got Update")


def lambda_handler(event, context):
    helper(event, context)
