export type view_LessonsAffectedByEvents = {
    eventId: string
    semesterId: string
    id: number
    room: string
    subject: string
    description: string
    semesterNr: number
    year: number
    weekDay: number
    startHHMM: number
    endHHMM: number
    teacherIds: number[]
    classIds: number[]
  }