using ConnectCampus.Domain.Common.Time;

namespace ConnectCampus.Infrastructure.Time;

public class MachineDateTime : IDateTimeMachine
{
    public DateTime UtcNow => DateTime.UtcNow;
    public DateTimeOffset UtcNowOffset => DateTimeOffset.UtcNow;
} 