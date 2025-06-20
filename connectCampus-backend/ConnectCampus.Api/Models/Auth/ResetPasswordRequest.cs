namespace ConnectCampus.Api.Models.Auth
{
    public class ResetPasswordRequest
    {
        /// <summary>
        /// Reset token received via email
        /// </summary>
        public string Token { get; set; } = string.Empty;
        
        /// <summary>
        /// New password
        /// </summary>
        public string NewPassword { get; set; } = string.Empty;
    }
} 