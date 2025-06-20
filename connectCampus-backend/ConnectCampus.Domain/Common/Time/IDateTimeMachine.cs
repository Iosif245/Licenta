namespace ConnectCampus.Domain.Common.Time;

public interface IDateTimeMachine
{
    DateTime UtcNow { get; }
    DateTimeOffset UtcNowOffset { get; }
} 