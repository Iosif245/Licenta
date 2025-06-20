using ConnectCampus.Domain.Enums;
using ConnectCampus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ConnectCampus.Infrastructure.Services;

public class StatusUpdateService : BackgroundService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<StatusUpdateService> _logger;
    private readonly TimeSpan _interval = TimeSpan.FromMinutes(1); // Run every 1 minute

    public StatusUpdateService(
        IServiceScopeFactory serviceScopeFactory,
        ILogger<StatusUpdateService> logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("StatusUpdateService started - will run every {Minutes} minute(s)", _interval.TotalMinutes);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await UpdateExpiredEventsToCompleted(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("StatusUpdateService is stopping...");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating event statuses");
            }

            try
            {
                await Task.Delay(_interval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("StatusUpdateService delay was cancelled - service is stopping");
                break;
            }
        }

        _logger.LogInformation("StatusUpdateService has stopped");
    }

    private async Task UpdateExpiredEventsToCompleted(CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        try
        {
            var currentUtcTime = DateTime.UtcNow;

            // Find all Published events that have ended (EndDate < current time)
            var expiredEvents = await dbContext.Events
                .Where(e => e.Status == EventStatus.Published && e.EndDate < currentUtcTime)
                .ToListAsync(cancellationToken);

            if (!expiredEvents.Any())
            {
                _logger.LogDebug("No expired events found at {CurrentTime}", currentUtcTime);
                return;
            }

            _logger.LogInformation("Found {Count} expired events to update to Completed status", expiredEvents.Count);

            var updatedCount = 0;
            
            foreach (var eventEntity in expiredEvents)
            {
                try
                {
                    // Use the domain method to mark as completed
                    eventEntity.MarkAsCompleted();
                    updatedCount++;

                    _logger.LogInformation(
                        "Updated event '{EventTitle}' (ID: {EventId}) to Completed - ended at {EndDate}",
                        eventEntity.Title,
                        eventEntity.Id,
                        eventEntity.EndDate);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, 
                        "Failed to update event '{EventTitle}' (ID: {EventId}) to Completed status",
                        eventEntity.Title,
                        eventEntity.Id);
                }
            }

            if (updatedCount > 0)
            {
                // Save all changes to the database
                var savedChanges = await dbContext.SaveChangesAsync(cancellationToken);
                _logger.LogInformation(
                    "Successfully updated {UpdatedCount} events to Completed status. Database changes saved: {SavedChanges}",
                    updatedCount,
                    savedChanges);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while processing expired events");
            throw;
        }
    }
} 