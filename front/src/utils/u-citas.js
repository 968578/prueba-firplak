/**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función calcula las fechas que deben ser excluidas de un calendario en función de los horarios de 
 * negocio proporcionados. Primero organiza los horarios por día de la semana, luego calcula las fechas a excluir 
 * basándose en la ausencia de horarios de atención (`timeSlots`) en esos días. El rango de fechas para la exclusión 
 * es de dos meses a partir de la fecha actual.
 *
 * @param {Array} businessHours - Un arreglo de objetos que contiene los horarios de negocio para cada día de la semana. 
 * Cada objeto tiene las propiedades `day` (nombre del día de la semana) y `timeSlots` (horarios disponibles para ese día).
 * 
 * @returns {Object} - Un objeto que contiene:
 *   - `excludeDates` (Array): Un arreglo de fechas que no tienen horarios disponibles para citas.
 *   - `todayLocal` (Date): La fecha actual en la zona horaria 'America/Bogota'.
 *   - `endDate` (Date): La fecha de dos meses después de la fecha actual.
 *   - `newBussinessHours` (Array): Un arreglo reorganizado de los horarios de negocio según el orden de días de la semana.
 */
const getExcludeDates = (businessHours) => {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  // lo pongo en otro arreglo para mantener siempre el orden de domingo a lunes
  const newBussinessHours = [];
  businessHours.forEach(d => {
    newBussinessHours[days.indexOf(d.day)] = d
  });

  const today = new Date();
  let todayLocal = today.toLocaleString('en-US', { timeZone: 'America/Bogota' });
  todayLocal = new Date(todayLocal);
  let endDate = new Date(todayLocal);
  endDate.setMonth(endDate.getMonth() + 2);

  let day = new Date(todayLocal);
  const excludeDates = [];
  while (day < endDate) {
    if (!newBussinessHours[day.getDay()].timeSlots.length) {
      excludeDates.push(new Date(day))
    }
    day.setDate(day.getDate() + 1);
  }
  return {
    excludeDates,
    todayLocal,
    endDate,
    newBussinessHours
  }
}

/**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función compara la diferencia entre dos fechas y verifica si esa diferencia es igual a un intervalo 
 * de tiempo especificado en minutos. Calcula la diferencia absoluta entre las fechas en milisegundos y luego la convierte 
 * en minutos, comparándola con el valor dado en `intervalMinutes`.
 *
 * @param {Date} date1 - La primera fecha a comparar.
 * @param {Date} date2 - La segunda fecha a comparar.
 * @param {number} intervalMinutes - El intervalo de tiempo en minutos con el cual se comparará la diferencia entre las dos fechas.
 *
 * @returns {boolean} - Devuelve `true` si la diferencia entre las fechas es igual al intervalo especificado en minutos, 
 * de lo contrario devuelve `false`.
 */
const isDifferenceEqualInterval = (date1, date2, intervalMinutes) => {

  const diffInMilliseconds = Math.abs(date2 - date1);
  const diffInMinutes = diffInMilliseconds / (1000 * 60);
  return diffInMinutes === intervalMinutes;
}

/**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función toma una lista de fechas (`allDateTimes`), una lista de citas del día (`appointmentsToday`), 
 * la fecha actual (`today`), los rangos de tiempo del día (`timeSlots`), y una fecha específica (`dateFormated`). 
 * Luego, filtra las fechas para determinar cuáles deben ser excluidas (es decir, bloqueadas debido a horarios de apertura/cierre 
 * o citas existentes), y las que deben ser incluidas (es decir, disponibles para seleccionar).
 *
 * @param {Array<Date>} allDateTimes - Una lista de fechas y horas para el día, representadas como objetos `Date`.
 * @param {Array<Object>} appointmentsToday - Una lista de citas para el día, cada una representada como un objeto con las propiedades `startDateTime` y `endDateTime` (fechas en formato ISO 8601).
 * @param {Date} today - La fecha actual en la que se está verificando la disponibilidad.
 * @param {Array<Object>} timeSlots - Los rangos de tiempo disponibles para la jornada, cada uno con las propiedades `startTime` y `endTime`.
 * @param {Date} dateFormated - La fecha que se está evaluando para determinar si debe ser bloqueada o permitida.
 *
 * @returns {Array} - Devuelve un arreglo con dos elementos:
 *   - `excludeTimes`: Un arreglo de fechas que deben ser bloqueadas, es decir, no disponibles.
 *   - `includeTimes`: Un arreglo de fechas que deben ser incluidas, es decir, disponibles.
 */
export const getExcludeTimes = (allDateTimes, appointmentsToday, today, timeSlots, dateFormated) => {

  const excludeTimes = [];
  // filtra horas de cierre y apertura
  const includeTimesObject = allDateTimes.map((d, i) => {
    return {
      day: d,
      include: true,
    }
  });

  allDateTimes.forEach((d, i) => {

    let isInclude = false;
    includeTimesObject[i].include = false;

    // verifico rango a rango que este dentro de los rangos de los slots
    timeSlots.forEach((time) => {
      const startTime = time.startTime.slice(0, 5);
      const endTime = time.endTime.slice(0, 5);
      const dateStart = new Date(dateFormated);
      const dateEnd = new Date(dateFormated);

      dateStart.setHours(Number(startTime.split(":")[0]), Number(startTime.split(":")[1]), 0, 0);
      dateEnd.setHours(Number(endTime.split(":")[0]), Number(endTime.split(":")[1]), 0, 0);

      if (d >= dateStart && d <= dateEnd && d >= today) {
        isInclude = true;
        includeTimesObject[i].include = true;
      }
    });

    // verifico que excluya los rangos de las citas de hoy tambien 
    appointmentsToday.forEach((a, ai) => {
      // obtengo el rango del appointment pero debo formatear la fecha
      const startDateTime = new Date(a.startDateTime.dateTime.split("Z")[0] + "Z");
      const endDateTime = new Date(a.endDateTime.dateTime.split("Z")[0] + "Z");

      // si una fecha esta dentro del rango que la agregue a los dias bloqueados.
      if (d > startDateTime && d < endDateTime) {
        isInclude = false;
        includeTimesObject[i].include = false;
      }
    });

    if (!isInclude) {
      excludeTimes.push(d);
    }
  });

  const includeTimes = includeTimesObject.reduce((acc, ele) => {
    if (ele.include) {
      acc.push(ele.day)
    }
    return acc
  }, []);

  return [excludeTimes, includeTimes];
}

/**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función filtra las horas disponibles en un conjunto de horas (`includeTimes`), 
 * tomando en cuenta los intervalos de tiempo (`intervalTime`) y la duración del servicio (`minutesService`). 
 * Su objetivo es identificar y devolver los intervalos de tiempo que deben ser excluidos para permitir la 
 * programación de citas según los parámetros establecidos.
 *
 * @param {Array<Date>} includeTimes - Un arreglo de fechas y horas disponibles para el día.
 * @param {number} intervalTime - El intervalo de tiempo (en minutos) entre cada opción disponible.
 * @param {number} minutesService - La duración del servicio en minutos.
 *
 * @returns {Array<Date>} - Devuelve un arreglo de fechas y horas que deben ser excluidas debido a las citas existentes o la duración del servicio.
 */
export const getExcludeTimesByAppoinments = (includeTimes, intervalTime, minutesService) => {
  const newExcludes = [];

  for (let i = 0; i < includeTimes.length; i++) {
    let interval = intervalTime;
    let countMinutes = intervalTime;
    forj:
    for (let j = i + 1; j < includeTimes.length; j++) {
      countMinutes += intervalTime
      if (isDifferenceEqualInterval(includeTimes[i], includeTimes[j], interval) && isDifferenceEqualInterval(includeTimes[j], includeTimes[j + 1], intervalTime)) {
        interval += intervalTime;
      } else {
        newExcludes.push(includeTimes[i]);
        break forj;
      }
      if (countMinutes === minutesService) {
        break forj;
      }
    }
  }

  // verificar que el final del dia si me deje agendar la reunión
  let counter = 0;
  for (let i = includeTimes.length - 1; i > 0; i--) {
    if (counter < minutesService) {
      newExcludes.push(includeTimes[i]);
    } else {
      break;
    }
    counter += intervalTime;
  }
  return newExcludes;
}

/**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función compara dos fechas para determinar si son exactamente iguales. 
 * Convierte ambas fechas a cadenas en formato ISO y las compara.
 *
 * @param {Date} date1 - La primera fecha a comparar.
 * @param {Date} date2 - La segunda fecha a comparar.
 *
 * @returns {boolean} - Retorna `true` si las fechas son exactamente iguales, de lo contrario, `false`.
 */
export const compareDates = (date1, date2) => {
  // Convertir las fechas a cadenas en el formato ISO para realizar la comparación
  const dateString1 = date1.toISOString();
  const dateString2 = date2.toISOString();

  // Comparar las cadenas de las fechas
  return dateString1 === dateString2;
}

/**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función genera una lista de todas las fechas y horas posibles dentro de un día especificado 
 * (por ejemplo, de 00:00 a 23:59) a intervalos determinados. Los intervalos de tiempo se definen en minutos 
 * y la función retorna un arreglo con todas las fechas generadas.
 *
 * @param {Date} dateFormated - La fecha base a partir de la cual se generan las fechas con intervalos. 
 *                              Normalmente es una fecha ya formateada con solo la parte de la fecha sin la hora.
 * @param {number} intervalTime - El intervalo de tiempo (en minutos) entre cada fecha generada.
 *
 * @returns {Array} - Retorna un arreglo con objetos `Date` que representan las fechas generadas a intervalos.
 */
export const getAllDateTimes = (dateFormated, intervalTime) => {
  const allDateTimes = [];
  for (let min = 0; min < 24 * 60; min += intervalTime) {
    const newDate = new Date(dateFormated.getTime() + min * 60000);
    allDateTimes.push(newDate);
  }
  return allDateTimes;
}

/**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función filtra una lista de citas (`appointments`) y retorna aquellas que ocurren 
 * en el mismo día que la fecha proporcionada (`dateFormated`). La comparación se realiza basándose en el año, 
 * mes y día, ignorando la hora exacta.
 *
 * @param {Array} appointments - Un arreglo de objetos de citas. Cada cita debe tener una propiedad `startDateTime`
 *                               que contenga la fecha y hora de inicio.
 * @param {Date} dateFormated - La fecha base a la cual se compararán las citas. Se asume que la fecha tiene el formato adecuado.
 *
 * @returns {Array} - Retorna un arreglo con las citas que ocurren en el mismo día que `dateFormated`.
 */
export const getAppointmentsToday = (appointments, dateFormated) => {
  const appointmentsToday = [];

  appointments.forEach((d) => {
    const startDateTime = new Date(d.startDateTime.dateTime);
    const sameYear = dateFormated.getFullYear() === startDateTime.getFullYear();
    const sameMonth = dateFormated.getMonth() === startDateTime.getMonth();
    const sameDay = dateFormated.getDate() === startDateTime.getDate();

    if (sameYear && sameMonth && sameDay) {
      appointmentsToday.push(d);
    }
  });

  return appointmentsToday;

}

/**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función recibe la configuración de una reserva (configBooking) y actualiza el estado 
 * `setConfigBooking` con la configuración de horarios de negocio, fechas excluidas, y los intervalos de tiempo de las citas.
 * Además, calcula las fechas de exclusión basadas en los horarios de negocio configurados y la fecha actual.
 * 
 * @param {Function} setConfigBooking - Función de actualización del estado donde se almacenará la configuración de reservas.
 * @param {Object} configBooking - Objeto que contiene la configuración de la reserva, incluyendo los horarios de negocio (`businessHours`), 
 *                                 el nombre de la empresa (`displayName`), y el intervalo de tiempo para las citas (`timeSlotInterval`).
 * 
 * @returns {void} - No retorna ningún valor, solo actualiza el estado con la nueva configuración de reservas.
 */
export const addConfigBookings = (setConfigBooking, configBooking) => {

  const { businessHours, displayName, timeSlotInterval } = configBooking;
  const { excludeDates, todayLocal, endDate, newBussinessHours } = getExcludeDates(businessHours);

  setConfigBooking({
    businessHours: newBussinessHours,
    displayName,
    timeSlotInterval,
    startDate: todayLocal,
    endDate,
    excludeDates,
  });
}

/**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función genera un filtro de fechas, retornando un rango que va desde la fecha actual 
 * hasta dos meses después de la misma. Las fechas están en formato ISO para ser utilizadas en consultas o filtros.
 * 
 * @returns {Array} - Un array con dos fechas en formato ISO:
 *                    1. La fecha de hoy con la hora ajustada a las 00:00:00.
 *                    2. La fecha correspondiente a dos meses después, también con la hora ajustada a las 00:00:00.
 */
export const getFiltroPorFechaCitas = () => {

  // Obtener la fecha de hoy
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sumar dos meses a la fecha actual
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 2);
  endDate.setHours(0, 0, 0, 0);

  return [today.toISOString(), endDate.toISOString()];
}

/**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función suma una cantidad de minutos a una fecha dada.
 * 
 * @param {Date} date - La fecha de inicio a la que se le agregarán los minutos.
 * @param {number} minutes - El número de minutos que se agregarán a la fecha.
 * 
 * @returns {Date} - Una nueva fecha con los minutos sumados.
 */
export const sumMinutes = (date, minutes) => {
  const dateStart = new Date(date);
  dateStart.setMinutes(dateStart.getMinutes() + minutes);
  return dateStart
}

/**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función formatea una fecha en formato `DD/MM/YYYY HH:MM AM/PM`.
 * 
 * @param {Date | string} date - La fecha a formatear. Puede ser un objeto `Date` o una cadena de texto.
 * 
 * @returns {string} - La fecha formateada como una cadena.
 */
export const formatedDate = (date) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Sumar 1 porque los meses van de 0 a 11
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours() % 12 || 12).padStart(2, '0'); // Obtener la hora en formato de 12 horas
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const ampm = dateObj.getHours() < 12 ? 'AM' : 'PM';

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}