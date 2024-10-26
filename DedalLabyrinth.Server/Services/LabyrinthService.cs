using DedalLabyrinth.Server.Data;
using DedalLabyrinth.Server.Entities;
using DedalLabyrinth.Server.Enums;
using DedalLabyrinth.Server.Models;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace DedalLabyrinth.Server.Services
{
    public class LabyrinthService
    {
        LabyrinthDAL _selectedLabyrinth = new LabyrinthDAL();
        private readonly IServiceScopeFactory _scopeFactory;

        public LabyrinthService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public LabyrinthDAL CreateLabyrinth(int rowCount, int columnCount, int density)
        {
            List<List<Tile>> matrix = GenerateLabyrinth(rowCount, columnCount, density);
            var serializedMatrix = JsonConvert.SerializeObject(matrix);

            _selectedLabyrinth = new LabyrinthDAL
            {
                Name = "Generated Labyrinth",
                Matrix = matrix,
                RowCount = rowCount,
                ColCount = columnCount
            };

            return _selectedLabyrinth;
        }

        private List<List<Tile>> GenerateLabyrinth(int rows, int columns, int density)
        {
            var random = new Random();
            List<List<Tile>> matrix = [];
            int grassTileMaxCount = (int)((100 - density) / 100.0 * (rows * columns));

            for (int i = 0; i < rows; i++)
            {
                List<Tile> row = [];
                for (int j = 0; j < columns; j++)
                {
                    row.Add(Tile.Wall);
                }

                matrix.Add(row);
            }

            Tuple<int, int> currentPos = new(random.Next(0, rows), random.Next(0, columns));
            List<Tuple<int, int>> points = [currentPos];
            int grassTileCount = 0;

            while (grassTileCount < grassTileMaxCount && !points.IsNullOrEmpty())
            {
                int randomPos = random.Next(0, points.Count);
                currentPos = points[randomPos];
                points.RemoveAt(randomPos);
                int row = currentPos.Item1;
                int col = currentPos.Item2;
                if (matrix[row][col] == Tile.Grass) continue;

                int nrNeighbours = 0;
                for (int di = -1; di <= 1; di++)
                {
                    for (int dj = -1; dj <= 1; dj++)
                    {
                        if (Math.Abs(di) == Math.Abs(dj)) continue;
                        int newdi = row + di;
                        int newdj = col + dj;
                        if (newdi < 0 || newdj < 0 || newdi >= rows || newdj >= columns) continue;
                        if (matrix[newdi][newdj] == Tile.Grass)
                        {
                            nrNeighbours++;
                        }
                    }
                }

                if (nrNeighbours > 1)
                {
                    continue;
                }

                matrix[row][col] = Tile.Grass;
                grassTileCount++;

                for (int di = -1; di <= 1; di++)
                {
                    for (int dj = -1; dj <= 1; dj++)
                    {
                        if (Math.Abs(di) == Math.Abs(dj)) continue;
                        int newdi = row + di;
                        int newdj = col + dj;
                        if (newdi < 0 || newdj < 0 || newdi >= rows || newdj >= columns) continue;
                        if (matrix[newdi][newdj] == Tile.Wall)
                        {
                            points.Add(new Tuple<int, int>(newdi, newdj));
                        }
                    }
                }
            }

            for (int row = 0; row < rows; row++)
            {
                for (int col = 0; col < columns; col++)
                {
                    if (grassTileCount >= grassTileMaxCount)
                    {
                        continue;
                    }

                    if (matrix[row][col] == Tile.Wall)
                    {
                        matrix[row][col] = Tile.Grass;
                        grassTileCount++;
                    }
                }
            }

            return matrix;
        }

        public List<LabyrinthDAL> GetAllLabyrinths()
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<LabyrinthContext>();

                // Fetch all labyrinths from the database
                var labyrinths = dbContext.Labyrinths.ToList();

                // Convert to LabyrinthDAL list
                var labyrinthsDAL = labyrinths.Select(l => new LabyrinthDAL
                {
                    Id = l.Id,
                    Name = l.Name,
                    Matrix = JsonConvert.DeserializeObject<List<List<Tile>>>(l.Matrix),
                    RowCount = l.RowCount,
                    ColCount = l.ColCount,
                    Path = JsonConvert.DeserializeObject<List<Tuple<int, int>>>(l.Path)
                }).ToList();

                return labyrinthsDAL;
            }
        }

        public LabyrinthDAL SelectLabyrinthById(int id)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<LabyrinthContext>();

                var labyrinth = dbContext.Labyrinths.Find(id);

                if (labyrinth == null)
                {
                    return null;
                }

                var labyrinthDAL = new LabyrinthDAL
                {
                    Id = labyrinth.Id,
                    Name = labyrinth.Name,
                    Matrix = JsonConvert.DeserializeObject<List<List<Tile>>>(labyrinth.Matrix),
                    RowCount = labyrinth.RowCount,
                    ColCount = labyrinth.ColCount,
                    Path = JsonConvert.DeserializeObject<List<Tuple<int, int>>>(labyrinth.Path)
                };

                _selectedLabyrinth = labyrinthDAL;

                return labyrinthDAL;
            }
        }


        public List<Tuple<int, int>> FindShortestPath(Tuple<int, int> start, Tuple<int, int> finish)
        {
            int rows = _selectedLabyrinth.RowCount;
            int columns = _selectedLabyrinth.ColCount;
            var matrix = _selectedLabyrinth.Matrix;

            var visited = new bool[rows, columns];
            var queue = new Queue<Tuple<int, int>>();
            var parents = new Dictionary<Tuple<int, int>, Tuple<int, int>>();
            var directions = new List<Tuple<int, int>>
            {
                new(-1, 0), // Up
                new(1, 0),  // Down
                new(0, -1), // Left
                new(0, 1)   // Right
            };

            queue.Enqueue(start);
            visited[start.Item1, start.Item2] = true;

            while (queue.Count > 0)
            {
                var current = queue.Dequeue();

                if (current.Equals(finish))
                {
                    var path = BuildPath(parents, start, finish);
                    _selectedLabyrinth.Path = path;
                    SaveLabyrinthPath();
                    return path;
                }

                foreach (var direction in directions)
                {
                    int newRow = current.Item1 + direction.Item1;
                    int newCol = current.Item2 + direction.Item2;

                    if (IsValidMove(newRow, newCol, rows, columns, matrix, visited))
                    {
                        queue.Enqueue(new Tuple<int, int>(newRow, newCol));
                        visited[newRow, newCol] = true;
                        parents[new Tuple<int, int>(newRow, newCol)] = current;
                    }
                }
            }

            return [];
        }

        public void SaveLabyrinthPath()
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<LabyrinthContext>();
                var serializedMatrix = JsonConvert.SerializeObject(_selectedLabyrinth.Matrix);
                var serializedPath = JsonConvert.SerializeObject(_selectedLabyrinth.Path);

                var newLabyrinth = new Labyrinth
                {
                    Name = _selectedLabyrinth.Name,
                    Matrix = serializedMatrix,
                    RowCount = _selectedLabyrinth.RowCount,
                    ColCount = _selectedLabyrinth.ColCount,
                    Path = serializedPath
                };

                dbContext.Labyrinths.Add(newLabyrinth);
                dbContext.SaveChanges();
            }
        }

        private List<Tuple<int, int>> BuildPath(Dictionary<Tuple<int, int>, Tuple<int, int>> parents, Tuple<int, int> start, Tuple<int, int> finish)
        {
            var path = new List<Tuple<int, int>>();
            var current = finish;

            while (current != null && !current.Equals(start))
            {
                path.Add(current);
                current = parents.ContainsKey(current) ? parents[current] : null;
            }
            path.Add(start);
            path.Reverse();

            // Mark the path in the matrix
            foreach (var pos in path.Skip(1).Take(path.Count - 2)) // Skip start and finish
            {
                _selectedLabyrinth.Matrix[pos.Item1][pos.Item2] = Tile.Dirt; // Mark the path with Dirt
            }

            // Mark start and finish
            _selectedLabyrinth.Matrix[start.Item1][start.Item2] = Tile.Start;
            _selectedLabyrinth.Matrix[finish.Item1][finish.Item2] = Tile.Finish;

            return path;
        }

        public void ResetPaths()
        {
            for (int row = 0; row < _selectedLabyrinth.RowCount; row++)
            {
                for (int col = 0; col < _selectedLabyrinth.ColCount; col++)
                {
                    if (_selectedLabyrinth.Matrix[row][col] != Tile.Wall)
                    {
                        _selectedLabyrinth.Matrix[row][col] = Tile.Grass;
                    }
                }
            }
        }

        private bool IsValidMove(int row, int col, int rows, int columns, List<List<Tile>> matrix, bool[,] visited)
        {
            return row >= 0 && col >= 0 && row < rows && col < columns &&
                   (matrix[row][col] == Tile.Grass || matrix[row][col] == Tile.Finish) &&
                   !visited[row, col];
        }

        public LabyrinthDAL GetCurrentLabyrinth()
        {
            return _selectedLabyrinth;
        }
    }
}
