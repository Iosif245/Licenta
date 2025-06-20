using Microsoft.EntityFrameworkCore;
using ConnectCampus.Domain.Entities;
using System.Reflection;
using MediatR;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Common.Time;

namespace ConnectCampus.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext, IDbContext
    {
        private readonly IDateTimeMachine _dateTimeMachine;
        private readonly IMediator _mediator;
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IDateTimeMachine dateTimeMachine, IMediator mediator)
            : base(options)
        {
            _dateTimeMachine = dateTimeMachine;
            _mediator = mediator;
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
        public DbSet<Certificate> Certificates { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;
        public DbSet<Student> Students { get; set; }
        public DbSet<Association> Associations { get; set; } = null!;
        public DbSet<Follow> Follows { get; set; } = null!;
        public DbSet<Event> Events { get; set; } = null!;
        public DbSet<Announcement> Announcements { get; set; } = null!;
        public DbSet<Report> Reports { get; set; } = null!;
        public DbSet<AnnouncementLike> AnnouncementLikes { get; set; } = null!;
        public DbSet<AnnouncementComment> AnnouncementComments { get; set; } = null!;
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; } = null!;
        public DbSet<TwoFactorCode> TwoFactorCodes { get; set; } = null!;
        public DbSet<StudentFavoriteEvent> StudentFavoriteEvents { get; set; } = null!;
        public DbSet<StudentEventRegistration> StudentEventRegistrations { get; set; } = null!;
        public DbSet<ChatGroup> ChatGroups { get; set; } = null!;
        public DbSet<ChatMessage> ChatMessages { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            
            base.OnModelCreating(modelBuilder);
        }
    }
} 