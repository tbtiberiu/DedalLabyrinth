using DedalLabyrinth.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace DedalLabyrinth.Server.Data
{
    public class LabyrinthContext : DbContext
    {
        public DbSet<Labyrinth> Labyrinths { get; set; }

        public LabyrinthContext(DbContextOptions<LabyrinthContext> options) : base(options)
        {
        }
    }
}
