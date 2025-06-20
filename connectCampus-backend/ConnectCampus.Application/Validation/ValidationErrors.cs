using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Validation;

public static class ValidationErrors
{
    public static class User
    {
        public static Error ProfessionistRoleRequired = Error.Forbidden();
        public static Error ClientRoleRequired = Error.Forbidden();
        public static readonly Error NotAuthenticated = Error.Forbidden();
        public static Error Forbidden = Error.Forbidden();
        public static Error IdNotMatched = Error.Forbidden();
        public static readonly Error NotFound = Error.Validation("User.NotFound", "User not found");
        
        public static Error IdentifierRequired = Error.Validation($"{nameof(User)}.{nameof(IdentifierRequired)}", "User identifier is required.");
        public static Error FirstNameRequired = Error.Validation($"{nameof(User)}.{nameof(FirstNameRequired)}", "First name is required.");
        public static Error LastNameRequired = Error.Validation($"{nameof(User)}.{nameof(LastNameRequired)}", "Last name is required.");
        public static Error FirstNameMinLength = Error.Validation($"{nameof(User)}.{nameof(FirstNameMinLength)}", "First name must be at least 4 characters.");
        public static Error LastNameMinLength = Error.Validation($"{nameof(User)}.{nameof(LastNameMinLength)}", "Last name must be at least 4 characters.");
        public static Error FirstNameMaxLength = Error.Validation($"{nameof(User)}.{nameof(FirstNameMaxLength)}", "First name must not exceed 100 characters.");
        public static Error LastNameMaxLength = Error.Validation($"{nameof(User)}.{nameof(LastNameMaxLength)}", "Last name must not exceed 100 characters.");
        public static Error EmailMaxLength = Error.Validation($"{nameof(User)}.{nameof(EmailMaxLength)}", "Email must not exceed 255 characters.");
        public static Error LocationMaxLength = Error.Validation($"{nameof(User)}.{nameof(LocationMaxLength)}", "Location must not exceed 100 characters.");
        public static Error PhoneNumberMaxLength = Error.Validation($"{nameof(User)}.{nameof(PhoneNumberMaxLength)}", "Phone number must not exceed 20 characters.");
        public static Error PhoneNumberInvalidFormat = Error.Validation($"{nameof(User)}.{nameof(PhoneNumberInvalidFormat)}", "Phone number format is invalid.");
        public static Error BioMaxLength = Error.Validation($"{nameof(User)}.{nameof(BioMaxLength)}", "Bio must not exceed 500 characters.");
   
    }
    
    public static class Auth
    {
        public static Error EmailRequired = Error.Validation($"{nameof(Auth)}.{nameof(EmailRequired)}", "Email is required.");
        public static Error InvalidEmail = Error.Validation($"{nameof(Auth)}.{nameof(InvalidEmail)}", "Email format is invalid.");
        public static Error PasswordRequired = Error.Validation($"{nameof(Auth)}.{nameof(PasswordRequired)}", "Password is required.");
        public static Error PasswordTooShort = Error.Validation($"{nameof(Auth)}.{nameof(PasswordTooShort)}", "Password must be at least 8 characters.");
        public static Error PasswordRequiresUppercase = Error.Validation($"{nameof(Auth)}.{nameof(PasswordRequiresUppercase)}", "Password must contain at least one uppercase letter.");
        public static Error PasswordRequiresLowercase = Error.Validation($"{nameof(Auth)}.{nameof(PasswordRequiresLowercase)}", "Password must contain at least one lowercase letter.");
        public static Error PasswordRequiresDigit = Error.Validation($"{nameof(Auth)}.{nameof(PasswordRequiresDigit)}", "Password must contain at least one digit.");
        public static Error PasswordRequiresNonAlphanumeric = Error.Validation($"{nameof(Auth)}.{nameof(PasswordRequiresNonAlphanumeric)}", "Password must contain at least one special character.");
        public static Error InvalidRole = Error.Validation($"{nameof(Auth)}.{nameof(InvalidRole)}", "Role must be 'client' or 'professional'.");
        public static Error RoleRequired = Error.Validation($"{nameof(Auth)}.{nameof(RoleRequired)}", "Role is required.");
        public static Error RefreshTokenRequired = Error.Validation($"{nameof(Auth)}.{nameof(RefreshTokenRequired)}", "Refresh token is required.");
        public static Error RefreshTokenNotFound = Error.NotFound($"{nameof(Auth)}.{nameof(RefreshTokenNotFound)}", "Refresh token not found.");
        public static Error TokenExpired = Error.Validation($"{nameof(Auth)}.{nameof(TokenExpired)}", "Token has expired.");
        public static Error UserAlreadyExists = Error.Conflict($"{nameof(Auth)}.{nameof(UserAlreadyExists)}", "A user with this email already exists.");
        public static readonly Error InvalidCredentials = Error.Validation("User.InvalidCredentials", "Invalid credentials");
        
        // Two-Factor Authentication
        public static Error UserIdRequired = Error.Validation($"{nameof(Auth)}.{nameof(UserIdRequired)}", "User ID is required.");
        public static Error InvalidUserId = Error.Validation($"{nameof(Auth)}.{nameof(InvalidUserId)}", "Invalid user ID format.");
        public static Error TwoFactorCodeRequired = Error.Validation($"{nameof(Auth)}.{nameof(TwoFactorCodeRequired)}", "Two-factor authentication code is required.");
        public static Error TwoFactorCodeInvalidLength = Error.Validation($"{nameof(Auth)}.{nameof(TwoFactorCodeInvalidLength)}", "Two-factor authentication code must be 6 digits.");
        public static Error TwoFactorCodeInvalidFormat = Error.Validation($"{nameof(Auth)}.{nameof(TwoFactorCodeInvalidFormat)}", "Two-factor authentication code must contain only numbers.");
        public static Error InvalidTwoFactorCode = Error.Validation($"{nameof(Auth)}.{nameof(InvalidTwoFactorCode)}", "Invalid or expired two-factor authentication code.");
    }

    public static class Certificate
    {
        public static Error NameRequired = Error.Validation($"{nameof(Certificate)}.{nameof(NameRequired)}",  "Certificate name is required.");
        
        public static Error NameMaxLength = Error.Validation($"{nameof(Certificate)}.{nameof(NameMaxLength)}", $"Certificate name max length is {Domain.Entities.Certificate.MaxNameLength}.");
        
        public static Error DocumentRequired = Error.Validation($"{nameof(Certificate)}.{nameof(DocumentRequired)}", "Document is required.");

        public static Error DocumentTypeInvalid = Error.Validation($"{nameof(Certificate)}.{nameof(DocumentTypeInvalid)}", "Image must be a JPEG, PNG, or PDF file");
        public static Error DocumentSizeLimit = Error.Validation($"{nameof(Certificate)}.{nameof(DocumentSizeLimit)}", "Image must be less than 5MB");
    }
    public static class Review
    {
        public static readonly Error NotFound = Error.Validation("Review.NotFound", "Review not found");
        public static readonly Error InvalidRating = Error.Validation("Review.InvalidRating", "Invalid rating");
        public static readonly Error InvalidComment = Error.Validation("Review.InvalidComment", "Invalid comment");
        public static readonly Error AlreadyExists = Error.Validation("Review.AlreadyExists", "Review already exists");
    }

    public static class Student
    {
        public static Error NotFound = Error.NotFound("Student.NotFound", "The student with the specified identifier was not found.");
        public static Error AlreadyExists = Error.Conflict("Student.AlreadyExists", "A student with the same email already exists.");
        public static Error InvalidOperation = Error.Validation("Student.InvalidOperation", "The operation cannot be performed on this student.");
        
        // Add more specific validation errors
        public static Error FirstNameRequired = Error.Validation("Student.FirstNameRequired", "First name is required.");
        public static Error LastNameRequired = Error.Validation("Student.LastNameRequired", "Last name is required.");
        public static Error EmailRequired = Error.Validation("Student.EmailRequired", "Email is required.");
        public static Error UniversityRequired = Error.Validation("Student.UniversityRequired", "University is required.");
        public static Error FacultyRequired = Error.Validation("Student.FacultyRequired", "Faculty is required.");
        public static Error SpecializationRequired = Error.Validation("Student.SpecializationRequired", "Specialization is required.");
        public static Error EducationLevelRequired = Error.Validation("Student.EducationLevelRequired", "Education level is required.");
        public static Error InvalidStudyYear = Error.Validation("Student.InvalidStudyYear", "Study year must be positive.");
        public static Error InterestsInvalid = Error.Validation("Student.InterestsInvalid", "One or more interests are invalid.");
        
        // Image upload validation errors
        public static Error AvatarRequired = Error.Validation("Student.AvatarRequired", "Avatar image is required.");
        public static Error AvatarSizeLimit = Error.Validation("Student.AvatarSizeLimit", "Avatar image must be less than 5MB.");
        public static Error AvatarTypeInvalid = Error.Validation("Student.AvatarTypeInvalid", "Avatar must be a JPEG or PNG file.");
    }
    
    public static class Association
    {
        public static Error NotFound = Error.NotFound("Association.NotFound", "The association with the specified identifier was not found.");
        public static Error AlreadyExists = Error.Conflict("Association.AlreadyExists", "An association with the same name already exists.");
        public static Error SlugAlreadyExists = Error.Conflict("Association.SlugAlreadyExists", "An association with the same slug already exists.");
        public static Error InvalidOperation = Error.Validation("Association.InvalidOperation", "The operation cannot be performed on this association.");
        
        // Validation errors
        public static Error NameRequired = Error.Validation("Association.NameRequired", "Association name is required.");
        public static Error SlugRequired = Error.Validation("Association.SlugRequired", "Slug is required.");
        public static Error DescriptionRequired = Error.Validation("Association.DescriptionRequired", "Description is required.");
        public static Error LogoRequired = Error.Validation("Association.LogoRequired", "Logo image is required.");
        public static Error CoverImageRequired = Error.Validation("Association.CoverImageRequired", "Cover image is required.");
        public static Error CategoryRequired = Error.Validation("Association.CategoryRequired", "Category is required.");
        public static Error FoundedYearRequired = Error.Validation("Association.FoundedYearRequired", "Founded year is required.");
        public static Error EmailRequired = Error.Validation("Association.EmailRequired", "Email is required.");
        public static Error InvalidEmail = Error.Validation("Association.InvalidEmail", "Email format is invalid.");
        public static Error InvalidFoundedYear = Error.Validation("Association.InvalidFoundedYear", "Founded year must be a valid year not in the future.");
        public static Error InvalidSlug = Error.Validation("Association.InvalidSlug", "Slug format is invalid. Use only lowercase letters, numbers and hyphens.");
        public static Error InvalidWebsite = Error.Validation("Association.InvalidWebsite", "Website URL format is invalid.");
        public static Error InvalidSocialLink = Error.Validation("Association.InvalidSocialLink", "Social media link format is invalid.");
        
        // Image upload validation errors
        public static Error LogoSizeLimit = Error.Validation("Association.LogoSizeLimit", "Logo image must be less than 5MB.");
        public static Error LogoTypeInvalid = Error.Validation("Association.LogoTypeInvalid", "Logo must be a JPEG or PNG file.");
        public static Error CoverImageSizeLimit = Error.Validation("Association.CoverImageSizeLimit", "Cover image must be less than 5MB.");
        public static Error CoverImageTypeInvalid = Error.Validation("Association.CoverImageTypeInvalid", "Cover image must be a JPEG or PNG file.");
    }

    public static class Event
    {
        public static readonly Error NotFound = Error.NotFound(
            "Event.NotFound",
            "Event with the specified identifier was not found.");
        
        public static readonly Error SlugAlreadyExists = Error.Conflict(
            "Event.SlugAlreadyExists",
            "An event with the same slug already exists.");
        
        public static readonly Error InvalidDateRange = Error.Validation(
            "Event.InvalidDateRange",
            "Event end date must be after start date.");
        
        public static readonly Error PastStartDate = Error.Validation(
            "Event.PastStartDate",
            "Event start date cannot be in the past.");
        
        public static readonly Error RegistrationDeadlineAfterStartDate = Error.Validation(
            "Event.RegistrationDeadlineAfterStartDate",
            "Registration deadline must be before event start date.");
        
        // Registration-related errors
        public static readonly Error NotPublished = Error.Validation(
            "Event.NotPublished",
            "Event must be published to allow registration.");
        
        public static readonly Error RegistrationNotRequired = Error.Validation(
            "Event.RegistrationNotRequired",
            "This event does not require registration.");
        
        public static readonly Error RegistrationDeadlinePassed = Error.Validation(
            "Event.RegistrationDeadlinePassed",
            "Registration deadline has passed.");
        
        public static readonly Error AlreadyRegistered = Error.Conflict(
            "Event.AlreadyRegistered",
            "Student is already registered for this event.");
        
        public static readonly Error CapacityReached = Error.Validation(
            "Event.CapacityReached",
            "Event has reached maximum capacity.");
        
        public static readonly Error NotRegistered = Error.Validation(
            "Event.NotRegistered",
            "Student is not registered for this event.");
        
        // Favorites-related errors
        public static readonly Error AlreadyFavorited = Error.Conflict(
            "Event.AlreadyFavorited",
            "Event is already in favorites.");
        
        public static readonly Error NotFavorited = Error.Validation(
            "Event.NotFavorited",
            "Event is not in favorites.");
    }

    public static class Announcement
    {
        public static readonly Error NotFound = Error.NotFound("Announcement.NotFound", "Announcement not found");
        public static readonly Error InvalidTitle = Error.Validation("Announcement.InvalidTitle", "Title is invalid or too long");
        public static readonly Error InvalidContent = Error.Validation("Announcement.InvalidContent", "Content is required");
        public static readonly Error InvalidImageUrl = Error.Validation("Announcement.InvalidImageUrl", "Image URL must not exceed 500 characters");
        public static readonly Error ImageUploadFailed = Error.Validation("Announcement.ImageUploadFailed", "Failed to upload image");
    }

    public static class Comment
    {
        public static readonly Error NotFound = Error.NotFound("Comment.NotFound", "Comment not found");
        public static readonly Error ParentNotFound = Error.NotFound("Comment.ParentNotFound", "Parent comment not found");
        public static readonly Error InvalidContent = Error.Validation("Comment.InvalidContent", "Comment content is required");
        public static readonly Error ContentTooLong = Error.Validation("Comment.ContentTooLong", "Comment content must not exceed 1000 characters");
        public static readonly Error InvalidAuthor = Error.Validation("Comment.InvalidAuthor", "Invalid comment author");
    }

    public static class Report
    {
        public static readonly Error NotFound = Error.NotFound("Report.NotFound", "Report not found");
        public static readonly Error InvalidReason = Error.Validation("Report.InvalidReason", "Reason is required and must not exceed 200 characters");
        public static readonly Error InvalidDescription = Error.Validation("Report.InvalidDescription", "Description is required and must not exceed 1000 characters");
        public static readonly Error InvalidStatus = Error.Validation("Report.InvalidStatus", "Invalid report status");
        public static readonly Error InvalidTargetType = Error.Validation("Report.InvalidTargetType", "Target type is required");
        public static readonly Error InvalidUser = Error.Forbidden();
    }
    
    public static class ChatGroup
    {
        public static Error NotFound => Error.NotFound("ChatGroup.NotFound", "Chat group not found");
        public static Error IdRequired => Error.Validation("ChatGroup.IdRequired", "Chat group id is required.");
        public static Error NotMember => Error.Validation("ChatGroup.NotMember", "User is not a member of this chat group");
        public static Error AlreadyExists => Error.Validation("ChatGroup.AlreadyExists", "Chat group already exists for these users");
    }

    public static class Message
    {
        public static Error Empty => Error.Validation("Message.Empty", "Message cannot be empty");
        public static Error TooLong => Error.Validation("Message.TooLong", "Message is too long");
    }

    public static class Notification
    {
        public static Error NotFound => Error.Validation("Notification.NotFound", "Notification not found");
        public static Error NotOwner => Error.Validation("Notification.NotOwner", "User is not the owner of this notification");
    }
}