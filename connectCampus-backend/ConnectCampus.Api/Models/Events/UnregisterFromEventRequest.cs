using System;
using System.ComponentModel.DataAnnotations;

namespace ConnectCampus.Api.Models.Events
{
    public class UnregisterFromEventRequest
    {
        /// <summary>
        /// The ID of the student unregistering from the event
        /// </summary>
        [Required]
        public Guid StudentId { get; set; }
    }
} 