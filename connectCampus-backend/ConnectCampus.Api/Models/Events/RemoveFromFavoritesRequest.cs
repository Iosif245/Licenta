using System;
using System.ComponentModel.DataAnnotations;

namespace ConnectCampus.Api.Models.Events
{
    public class RemoveFromFavoritesRequest
    {
        /// <summary>
        /// The ID of the student removing the event from favorites
        /// </summary>
        [Required]
        public Guid StudentId { get; set; }
    }
} 