from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string


def send_submission_received(submission):
    """Sent to author immediately after submission."""
    subject = f"Submission Received: {submission.title[:60]}"
    message = f"""Dear {submission.submitter.get_full_name() or submission.submitter.username},

Thank you for submitting your manuscript to the {settings.JOURNAL_NAME}.

Submission Details:
- Title: {submission.title}
- Category: {submission.category.name if submission.category else 'N/A'}
- Submitted: {submission.submitted_at.strftime('%B %d, %Y')}

Your submission is now under editorial review. You will be notified of any status updates via email.

You can track your submission status at any time by logging into your dashboard.

Best regards,
Editorial Team
{settings.JOURNAL_NAME}
"""
    _send(subject, message, [submission.submitter.email])


def send_submission_status_changed(submission):
    """Sent when admin changes submission status."""
    status_messages = {
        'accepted':  'Congratulations! Your manuscript has been ACCEPTED for peer review.',
        'rejected':  'We regret to inform you that your manuscript has not been accepted at this time.',
        'converted': 'Your manuscript has been accepted and is now being processed for publication.',
        'under_review': 'Your manuscript has been sent out for peer review.',
    }
    message_body = status_messages.get(
        submission.status,
        f'Your submission status has been updated to: {submission.get_status_display()}'
    )

    subject = f"Submission Update: {submission.title[:60]}"
    message = f"""Dear {submission.submitter.get_full_name() or submission.submitter.username},

{message_body}

Submission: {submission.title}

{"Our editorial notes: " + submission.admin_notes if submission.admin_notes else ""}

Log in to your dashboard to view full details.

Best regards,
Editorial Team
{settings.JOURNAL_NAME}
"""
    _send(subject, message, [submission.submitter.email])


def send_article_published(article):
    """Sent to corresponding author when article goes live."""
    if not article.corresponding_author or not article.corresponding_author.email:
        return

    doi_line = f"DOI: {article.doi}" if article.doi and not article.doi.startswith('10.pending') else ""

    subject = f"Your Article is Now Published: {article.title[:60]}"
    message = f"""Dear {article.corresponding_author.get_full_name()},

We are pleased to inform you that your article has been published in the {settings.JOURNAL_NAME}.

Article: {article.title}
Volume: {article.volume_number if hasattr(article, 'volume_number') else ''}
Pages: {article.pages}
{doi_line}

Thank you for your contribution to the journal.

Best regards,
Editorial Team
{settings.JOURNAL_NAME}
"""
    _send(subject, message, [article.corresponding_author.email])


def _send(subject, message, recipient_list):
    """Internal helper — never raises, logs failures silently."""
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            fail_silently=False,
        )
    except Exception as e:
        # Log but don't crash the request
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Email failed to {recipient_list}: {e}")