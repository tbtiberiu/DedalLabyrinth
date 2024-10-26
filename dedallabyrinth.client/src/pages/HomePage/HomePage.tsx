import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import Labyrinth from '../../components/Labyrinth/Labytinth';
import Navbar from '../../components/Navbar/Navbar';
import styles from './HomePage.module.css';
import axios from 'axios';
import { LabyrinthType } from '../../types/LabyrinthType';
import NewLabyrinthDialog from '../../components/Dialog/NewLabyrinthDialog';
import { PointType } from '../../types/PointType';

const HomePage: React.FC = () => {
  const baseUrl = 'https://localhost:7031/Labyrinth';
  const [labyrinth, setLabyrinth] = useState<LabyrinthType | null>(null);
  const [startPoint, setStartPoint] = useState<PointType>({ x: -1, y: -1 });
  const [finishPoint, setFinishPoint] = useState<PointType>({ x: -1, y: -1 });
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => setOpenDialog(false);
  const handleDialogSubmit = (
    rowCount: number,
    columnCount: number,
    density: number
  ) => createNewLabyrinth(rowCount, columnCount, density);

  const handleStartPointChange = (x: number, y: number) =>
    setStartPoint({ x: x, y: y });

  const handleFinishPointChange = (x: number, y: number) =>
    setFinishPoint({ x: x, y: y });

  useEffect(() => {
    getCurrentLabyrinth();
  }, []);

  const getCurrentLabyrinth = async () => {
    try {
      setStartPoint({ x: -1, y: -1 });
      setFinishPoint({ x: -1, y: -1 });
      const response = await axios.get(`${baseUrl}/current`);

      const currentLabyrinth: LabyrinthType = response.data;
      setLabyrinth(currentLabyrinth);
    } catch (error) {
      console.error('Error fetching current labyrinth: ', error);
    }
  };

  const createNewLabyrinth = async (
    rowCount: number,
    columnCount: number,
    density: number
  ) => {
    try {
      setStartPoint({ x: -1, y: -1 });
      setFinishPoint({ x: -1, y: -1 });
      const response = await axios.get(`${baseUrl}/generate`, {
        params: {
          rowCount: rowCount,
          columnCount: columnCount,
          density: density,
        },
      });

      const newLabyrinth: LabyrinthType = response.data;
      setLabyrinth(newLabyrinth);
    } catch (error) {
      console.error('Error creating labyrinth: ', error);
    }
  };

  const generatePath = async () => {
    try {
      const response = await axios.get(`${baseUrl}/find-path`, {
        params: {
          startRow: startPoint.x,
          startCol: startPoint.y,
          finishRow: finishPoint.x,
          finishCol: finishPoint.y,
        },
      });

      const newLabyrinth: LabyrinthType = response.data;
      setLabyrinth(newLabyrinth);
    } catch (error) {
      console.error('Error finding path: ', error);
    }
  };

  return (
    <div className={styles.HomePage}>
      <Navbar />
      <NewLabyrinthDialog
        open={openDialog}
        onClose={handleClose}
        onSubmitClicked={handleDialogSubmit}
      />
      {labyrinth && labyrinth.matrix.length > 0 ? (
        <Labyrinth
          labyrinth={labyrinth}
          onStartPointChange={handleStartPointChange}
          onFinishPointChange={handleFinishPointChange}
          active={true}
          startPoint={startPoint}
          finishPoint={finishPoint}
        />
      ) : (
        <div className={styles.NoLabyrinthText}>
          No labyrinth selected. You can create one or select from past
          generated labyrinth.
        </div>
      )}
      <div className={styles.Details}>
        <div className={styles.Counts}>
          <p>
            Row Count: <span>{labyrinth?.rowCount}</span>
          </p>
          <p>
            Column Count: <span>{labyrinth?.colCount}</span>
          </p>
        </div>
        <div className={styles.Buttons}>
          <Button onClick={handleOpen}>New Labyrinth</Button>
          <Button onClick={generatePath}>Generate path</Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
