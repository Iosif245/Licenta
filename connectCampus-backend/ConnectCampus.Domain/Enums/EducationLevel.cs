using ConnectCampus.Domain.Common;

namespace ConnectCampus.Domain.Enums
{
    public class EducationLevel : Enumeration
    {
        public static readonly EducationLevel Bachelor = new(1, "Bachelor");
        public static readonly EducationLevel Master = new(2, "Master");
        public static readonly EducationLevel PhD = new(3, "PhD");

        public EducationLevel(int id, string name) : base(id, name)
        {
        }

        public static IEnumerable<EducationLevel> List() => [
            Bachelor,
            Master,
            PhD
        ];

        public static EducationLevel? FromName(string? name)
        {
            return FromName<EducationLevel>(name);
        }

        public static EducationLevel? FromValue(int value)
        {
            return FromValue<EducationLevel>(value);
        }
    }
} 