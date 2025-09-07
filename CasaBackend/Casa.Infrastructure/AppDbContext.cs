using Casa.InterfaceAdapter.Models;
using CasaBackend.Casa.InterfaceAdapter.Models;
using CasaBackend.Casa.InterfaceAdapter.Models.Capabilities;
using Microsoft.EntityFrameworkCore;

namespace CasaBackend.Casa.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<DeviceModel> Devices { get; set; }
        public DbSet<DimmableModel> Dimmables { get; set; }
        public DbSet<VelocityModel> Velocities { get; set; }
        public DbSet<RoomModel> Rooms { get; set; }
        public DbSet<RoomDeviceModel> RoomDevices { get; set; }
        public DbSet<AutomationModel> Automations { get; set; }
        public DbSet<AutomationDeviceModel> AutomationDevices { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DeviceModel>().ToTable("device");
            modelBuilder.Entity<DimmableModel>().ToTable("dimmable");
            modelBuilder.Entity<VelocityModel>().ToTable("velocity");
            modelBuilder.Entity<RoomModel>()
                .ToTable("room")
                .HasMany(r => r.RoomDevices)
                .WithOne()
                .HasForeignKey(rd => rd.RoomId);
            modelBuilder.Entity<RoomDeviceModel>().ToTable("room_device");

            modelBuilder.Entity<AutomationModel>()
                .ToTable("automation")
                .HasMany(a => a.Devices)
                .WithOne()
                .HasForeignKey(ad => ad.AutomationId);

            modelBuilder.Entity<AutomationDeviceModel>()
                .ToTable("automation_device")
                .HasOne(ad => ad.Device)
                .WithMany()
                .HasForeignKey(d => d.DeviceId);
        }
    }
}
