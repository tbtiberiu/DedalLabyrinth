using System.ComponentModel.DataAnnotations;

namespace DedalLabyrinth.Server.Models
{
    public class Labyrinth
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public string? Matrix { get; set; }

        [Required]
        public int RowCount { get; set; } = 0;
        
        [Required]
        public int ColCount { get; set; } = 0;

        [Required]
        public string? Path {  get; set; }
    }
}
