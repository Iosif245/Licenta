using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Domain.Common;

public static class DomainErrors
{
    public static class User
    {
        public static Error NotFound => 
            Error.NotFound("User.NotFound", "User not found");
        
        public static Error InvalidEmail => 
            Error.Validation("User.InvalidEmail", "Email is invalid");
        
        public static Error InvalidPassword => 
            Error.Validation("User.InvalidPassword", "Password is invalid");
        
        public static Error NotEnoughPermissions => 
            Error.Forbidden();
    }
    public static class Certificate
    {
        public static Error ProfessionistRoleRequired = Error.Forbidden();
    }
    public static class General
    {
        public static Error NotFound(string entityName) => 
            Error.NotFound($"{entityName}.NotFound", $"{entityName} not found");
        
        public static Error ValueIsInvalid() => 
            Error.Validation("General.ValueIsInvalid", "The value is invalid");
        
        public static Error ValueIsRequired() => 
            Error.Validation("General.ValueIsRequired", "Value is required");
        
        public static Error InvalidLength(string name, int minLength, int maxLength) => 
            Error.Validation(
                $"General.{name}InvalidLength", 
                $"{name} must be between {minLength} and {maxLength} characters");
        
        public static Error UnprocessableOperation(string details) => 
            Error.Validation("General.UnprocessableOperation", $"Operation cannot be processed: {details}");
    }
    
    public static class Authentication
    {
        public static Error InvalidCredentials => 
            Error.Validation("Auth.InvalidCredentials", "Invalid credentials");
        
        public static Error UserNotAuthenticated => 
            Error.Unauthorized("Auth.UserNotAuthenticated", "User is not authenticated");
        
        public static Error UserAlreadyExists => 
            Error.Conflict("Auth.UserAlreadyExists", "User with this email already exists");
        
        public static Error InvalidToken => 
            Error.Validation("Auth.InvalidToken", "Token is invalid");
        
        public static Error ExpiredToken => 
            Error.Validation("Auth.ExpiredToken", "Token has expired");
        
        public static Error RefreshTokenNotFound => 
            Error.NotFound("Auth.RefreshTokenNotFound", "Refresh token not found");
        
        public static Error UserNotInRole(string role) => 
            Error.Unauthorized("Auth.UserNotInRole", $"User is not in role: {role}");
    }
    
    public static class Offer
    {
        public static Error NotFound => 
            Error.NotFound("Offer.NotFound", "Offer not found");
        
        public static Error NotAuthorized => 
            Error.Unauthorized("Offer.NotAuthorized", "You are not authorized to access this offer");
        
        public static Error AlreadyAccepted => 
            Error.Conflict("Offer.AlreadyAccepted", "Offer has already been accepted");
        
        public static Error InvalidStatus(string details) => 
            Error.Validation("Offer.InvalidStatus", $"Invalid offer status: {details}");
        
        public static Error InvalidStatusTransition() =>
            Error.Validation("Offer.InvalidStatusTransition", "Invalid status transition for the current offer state");
    }
    
    public static class ExternalServices
    {
        public static Error StripeUnavailable(string details) => 
            Error.ServiceUnavailable("ExternalServices.StripeUnavailable", $"Stripe payment service is unavailable: {details}");
        
        public static Error S3Unavailable(string details) => 
            Error.ServiceUnavailable("ExternalServices.S3Unavailable", $"S3 storage service is unavailable: {details}");
        
        public static Error EmailServiceUnavailable(string details) => 
            Error.ServiceUnavailable("ExternalServices.EmailUnavailable", $"Email service is unavailable: {details}");
        
        public static Error ExternalServiceError(string serviceName, string details) => 
            Error.ServiceUnavailable($"ExternalServices.{serviceName}Error", $"{serviceName} service error: {details}");
    }
    
    public static class Professional
    {
        public static Error OnlyForProfessionals(string action) => 
            Error.Validation("Professional.RoleRequired", $"Only professionals can {action}");
        
        public static Error CategoryAlreadyExists => 
            Error.Conflict("Professional.CategoryExists", "This category is already added");
        
        public static Error CategoryNotFound => 
            Error.NotFound("Professional.CategoryNotFound", "This category is not added to the professional");
    }
    
    public static class Chat
    {
        public static Error NotFound => 
            Error.NotFound("Chat.NotFound", "Chat not found");
        
        public static Error NotParticipant => 
            Error.Unauthorized("Chat.NotAuthorized", "You are not a participant in this chat");
        
        public static Error MessageNotFound => 
            Error.NotFound("Chat.MessageNotFound", "Message not found");
    }
    
    public static class Category 
    {
        public static Error Invalid(string categoryName) => 
            Error.Validation("Category.Invalid", $"Category '{categoryName}' is not valid");
        
        public static Error Required => 
            Error.Validation("Category.Required", "Category is required");
    }
} 