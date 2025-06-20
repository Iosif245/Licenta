using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConnectCampus.Domain.Entities
{
    public sealed class Follow
    {
        [Key]
        public int Id { get; private set; }
        public Guid StudentId { get; private set; }
        public Guid AssociationId { get; private set; }
        public DateTime CreatedAt { get; private set; }

        [ForeignKey(nameof(StudentId))]
        public Student Student { get; private set; } = null!;
        
        [ForeignKey(nameof(AssociationId))]
        public Association Association { get; private set; } = null!;

        private Follow() { } // For EF Core

        public Follow(Guid studentId, Guid associationId)
        {
            StudentId = studentId;
            AssociationId = associationId;
            CreatedAt = DateTime.UtcNow;
        }
    }
} 