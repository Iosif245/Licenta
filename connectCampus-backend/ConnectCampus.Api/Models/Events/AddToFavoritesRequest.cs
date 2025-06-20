using System;
using System.ComponentModel.DataAnnotations;

namespace ConnectCampus.Api.Models.Events
{
    public class AddToFavoritesRequest
    {
        /// <summary>
        /// The ID of the student adding the event to favorites
        /// </summary>
        [Required]
        public Guid StudentId { get; set; }
    }
} 