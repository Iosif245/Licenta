namespace ConnectCampus.Api.Models.Auth
{
    public class ForgotPasswordRequest
    {
        /// <summary>
        /// Email address of the user requesting password reset
        /// </summary>
        public string Email { get; set; } = string.Empty;
    }
} 