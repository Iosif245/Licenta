using Microsoft.AspNetCore.Authorization;

namespace ConnectCampus.Api.Common.Attributes
{
    public static class Roles
    {
        public const string Student = "Student";
        public const string Association = "Association";
        public const string Admin = "Admin";
    }
    public class HasRoleAttribute : AuthorizeAttribute
    {
        public HasRoleAttribute(params string[] roles)
        {
            Roles = string.Join(",", roles);
        }
    }
} 