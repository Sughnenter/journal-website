from django.core.management.base import BaseCommand
from django.utils import timezone
from journal.models import Volume, Issue

class Command(BaseCommand):
    help = 'Creates the next issue, closing the current one first.'

    def handle(self, *args, **kwargs):
        now = timezone.now()

        # Close current issue
        Issue.objects.filter(is_published=True, volume__is_current=True).update(
            is_published=False
        )

        # Get or create current volume
        current_volume = Volume.objects.filter(is_current=True).first()
        if not current_volume:
            current_volume = Volume.objects.create(
                number=1, year=now.year, is_current=True
            )
            self.stdout.write(f'Created Volume {current_volume.number}')

        # What's the next issue number in this volume?
        last_issue = Issue.objects.filter(volume=current_volume).order_by('-number').first()
        next_number = (last_issue.number + 1) if last_issue else 1

        # If we've hit 4 issues, roll over to a new volume (adjust to your schedule)
        if next_number > 4:
            Volume.objects.filter(is_current=True).update(is_current=False)
            current_volume = Volume.objects.create(
                number=current_volume.number + 1,
                year=now.year,
                is_current=True
            )
            next_number = 1
            self.stdout.write(f'Rolled over to Volume {current_volume.number}')

        new_issue = Issue.objects.create(
            volume=current_volume,
            number=next_number,
            year=now.year,
            month=now.strftime('%B'),
            publication_date=now.date(),
            is_published=True
        )
        self.stdout.write(
            self.style.SUCCESS(
                f'Created Issue {new_issue.number}, Volume {current_volume.number} ({now.strftime("%B %Y")})'
            )
        )