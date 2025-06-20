namespace ConnectCampus.Api.Models.Auth
{
    /// <summary>
    /// Request model for verifying two-factor authentication code
    /// </summary>
    public class VerifyTwoFactorRequest
    {
        /// <summary>
        /// User ID from the initial login response
        /// </summary>
        public string UserId { get; set; } = null!;
        
        /// <summary>
        /// Six-digit verification code sent via email
        /// </summary>
        public string Code { get; set; } = null!;
    }
} 