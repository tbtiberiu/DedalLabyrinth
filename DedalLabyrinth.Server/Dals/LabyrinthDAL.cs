using DedalLabyrinth.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace DedalLabyrinth.Server.Entities
{
    public class LabyrinthDAL
    {
        public int Id { get; set; } = 0;
        public string? Name { get; set; } = "";
        public List<List<Tile>> Matrix { get; set; } = [];
        public int RowCount { get; set; } = 0;
        public int ColCount { get; set; } = 0;
    }
}
