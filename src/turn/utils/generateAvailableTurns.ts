import { Turn } from '../entities/turn.entity';

const START_HOUR = 8;
const FINISH_HOUR = 17;
const TURN_SPACE = 15;
export function getHourAvailableForDay(reservedTurn: Turn[] = []) {
  // Crear un array con los turnos disponibles
  const availableTurn = [];
  for (let hora = START_HOUR; hora <= FINISH_HOUR; hora++) {
    for (let minute = 0; minute < 60; minute += TURN_SPACE) {
      const hourMinute = `${hora}:${minute < 10 ? '0' : ''}${minute}`;
      const isAvailable = !reservedTurn.find(
        (turn) => turn.hour === hourMinute,
      );
      availableTurn.push({
        hourMinute,
        isAvailable,
      });
      // if (!reservedTurn.find((turn) => turn.hour === hourMinute)) {
      //   availableTurn.push(hourMinute);
      // }
    }
  }
  return availableTurn;
}
