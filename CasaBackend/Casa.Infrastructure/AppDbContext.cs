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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DeviceModel>().ToTable("device");
            modelBuilder.Entity<DimmableModel>().ToTable("dimmable");
            modelBuilder.Entity<VelocityModel>().ToTable("velocity");
        }
    }
}
