from celery.decorators import task, periodic_task
from celery.utils.log import get_task_logger

from schema.youps import ImapAccount, TaskScheduler, PeriodicTask

import json, ujson, types, marshal, random

logger = get_task_logger(__name__)

@task(name="add_periodic_task")
def add_periodic_task(interval, args):
    """ create a new periodic task

    Args:
        interval (number): interval of how often to run the code in sec
        the rest args are same as imap.interpret's
        args (json): arguments for interpret () function
    """
    logger.info("ADD TASK performed!")
    
    # args = json.dumps([imap_account_id, code, search_creteria])
    ptask_name = "%d_%d" % (args[0], random.randint(1, 10000)) 
    TaskScheduler.schedule_every('run_interpret', 'seconds', interval, ptask_name, args)

@task(name="remove_periodic_task")
def remove_periodic_task(imap_account_id, ptask_name=None):
    """ remove a new periodic task. If ptask_name is given, then remove that specific task.
    Otherwise remove all tasks that are associated with the IMAP account ID. 

    Args:
        imap_account_id (number): id of associated ImapAccount object
        ptask_name (string): a name of the specific task to be deleted
    """
    if ptask_name is None:
        ptask_prefix = '%d_' % imap_account_id
        PeriodicTask.objects.filter(name__startswith=ptask_prefix).delete()

    else:
        PeriodicTask.objects.filter(name=ptask_name).delete()

@task(name="run_interpret")
def run_interpret(imap_account_id, code, search_creteria, is_test=False, email_content=None):
    """ execute 

    Args:
        imap_account_id (number): id of associated ImapAccount object
        code (code object): which code to run
        search_creteria (string): IMAP query. To which email to run the code
        is_test (boolean): True- just printing the log. False- executing the code
        email_content (string): for email shortcut --> potential deprecate  
    """
    code = marshal.loads(code)
    from browser.imap import interpret, authenticate
    imap_account = ImapAccount.objects.get(id=imap_account_id)
    auth_res = authenticate( imap_account )
    # TODO auth handling
    if not auth_res['status']:
        raise ValueError('Something went wrong during authentication. Refresh and try again!')
        
    imap = auth_res['imap']
    imap.select_folder('INBOX')
    res = interpret(imap_account, imap, code, search_creteria, is_test, email_content)
    print res['imap_log']

    logger.info(res['imap_log'])
    # TODO add logs to users' execution_log

# @periodic_task(run_every=(crontab(minute='*/15')), name="some_task", ignore_result=True)
# def some_task():
#     # do something
#     logger.info("Saved image from Flickr")
#     print ("perioid task")