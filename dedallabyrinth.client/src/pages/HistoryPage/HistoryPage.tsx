import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './HistoryPage.module.css';
import { LabyrinthType } from '../../types/LabyrinthType';
import axios from 'axios';
import Labyrinth from '../../components/Labyrinth/Labytinth';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
  const baseUrl = 'https://localhost:7031/Labyrinth';
  const [labyrinths, setLabyrinths] = useState<LabyrinthType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAllLabyrinths();
  }, []);

  const getAllLabyrinths = async () => {
    try {
      const response = await axios.get(`${baseUrl}/all`);

      const allLabyrinths: LabyrinthType[] = response.data;
      setLabyrinths(allLabyrinths);
    } catch (error) {
      console.error('Error fetching all labyrinths: ', error);
    }
  };

  const handleLabyrinthChange = async (labyrinthId: number) => {
    try {
      const response = await axios.post(`${baseUrl}/${labyrinthId}`);

      if (response.status === 200) {
        console.log(`Selected labyrinth with ID: ${labyrinthId}`);
        navigate('/');
      }
    } catch (error) {
      console.error(
        `Error selecting labyrinth with ID ${labyrinthId}: `,
        error
      );
    }
  };

  return (
    <div className={styles.HistoryPage}>
      <Navbar />

      <div className={styles.Labyrinths}>
        {labyrinths.map((labyrinth) => (
          <div
            key={labyrinth.id}
            className={styles.LabyrinthItem}
            onClick={() => handleLabyrinthChange(labyrinth.id)}
          >
            <div className={styles.Matrix}>
              <Labyrinth active={false} labyrinth={labyrinth} />
            </div>
            <div className={styles.LabyrinthDetails}>
              <p>Rows: {labyrinth.rowCount}</p>
              <p>Columns: {labyrinth.colCount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
