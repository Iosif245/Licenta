namespace ConnectCampus.Application.Common.Interfaces
{
    /// <summary>
    /// Interface for generating URL-friendly slugs from strings
    /// </summary>
    public interface ISlugGenerator
    {
        /// <summary>
        /// Generates a URL-friendly slug from the given text
        /// </summary>
        /// <param name="text">The text to convert to a slug</param>
        /// <returns>A URL-friendly slug</returns>
        string Generate(string text);
    }
} 