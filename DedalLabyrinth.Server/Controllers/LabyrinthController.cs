using DedalLabyrinth.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace DedalLabyrinth.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LabyrinthController : ControllerBase
    {
        private readonly LabyrinthService _labyrinthService;

        public LabyrinthController(LabyrinthService labyrinthService)
        {
            _labyrinthService = labyrinthService;
        }

        [HttpGet("current")]
        public IActionResult CreateLabyrinth()
        {
            var labyrinthDAL = _labyrinthService.GetCurrentLabyrinth();

            return Ok(labyrinthDAL);
        }


        [HttpGet("generate")]
        public IActionResult CreateLabyrinth(int rowCount, int columnCount, double density)
        {
            if (rowCount <= 0 || columnCount <= 0 || density < 0 || density > 1)
                return BadRequest("Invalid input parameters.");

            var labyrinthDAL = _labyrinthService.CreateLabyrinth(rowCount, columnCount, density);

            return Ok(labyrinthDAL);
        }

        [HttpGet("find-path")]
        public IActionResult FindShortestPath(int startRow, int startCol, int finishRow, int finishCol)
        {
            if (startRow < 0 || startCol < 0 || finishRow < 0 || finishCol < 0)
                return BadRequest("Coordinates cannot be negative.");

            _labyrinthService.ResetPaths();
            var labyrinth = _labyrinthService.GetCurrentLabyrinth();
            if (labyrinth == null)
                return NotFound("No labyrinth found. Please generate a labyrinth first.");

            if (startRow >= labyrinth.RowCount || startCol >= labyrinth.ColCount ||
                finishRow >= labyrinth.RowCount || finishCol >= labyrinth.ColCount)
            {
                return BadRequest("Start or finish coordinates are out of bounds.");
            }

            var start = new Tuple<int, int>(startRow, startCol);
            var finish = new Tuple<int, int>(finishRow, finishCol);
            var path = _labyrinthService.FindShortestPath(start, finish);

            if (path.Count == 0)
                return NotFound("No path found from the start to finish.");

            labyrinth = _labyrinthService.GetCurrentLabyrinth();

            return Ok(labyrinth);
        }
    }
}
