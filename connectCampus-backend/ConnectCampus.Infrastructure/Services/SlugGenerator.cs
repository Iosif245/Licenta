using System;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using ConnectCampus.Application.Common.Interfaces;

namespace ConnectCampus.Infrastructure.Services
{
    public class SlugGenerator : ISlugGenerator
    {
        public string Generate(string text)
        {
            if (string.IsNullOrEmpty(text))
                return string.Empty;

            // Convert to lowercase
            string slug = text.ToLowerInvariant();

            // Remove diacritics (accents)
            slug = RemoveDiacritics(slug);

            // Replace spaces with hyphens
            slug = Regex.Replace(slug, @"\s", "-");

            // Remove invalid characters
            slug = Regex.Replace(slug, @"[^a-z0-9\-]", string.Empty);

            // Replace multiple hyphens with a single hyphen
            slug = Regex.Replace(slug, @"--+", "-");

            // Trim hyphens from beginning and end
            slug = slug.Trim('-');

            return slug;
        }

        private string RemoveDiacritics(string text)
        {
            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }
    }
} 