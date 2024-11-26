import { format, differenceInWeeks, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Patient } from '../../contexts/PatientContext';

export class JSONExporter {
  public static async generate(patient: Patient): Promise<string> {
    try {
      const data = {
        patient: {
          name: `${patient.lastName} ${patient.firstName}`,
          nameKana: `${patient.lastNameKana} ${patient.firstNameKana}`,
          firstVisitDate: format(new Date(patient.firstVisitDate), 'yyyy年M月d日', { locale: ja }),
        },
        chartEntries: patient.chartEntries
          ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map(entry => {
            const entryDate = new Date(entry.date);
            const firstVisitDate = new Date(patient.firstVisitDate);
            const weeks = differenceInWeeks(entryDate, firstVisitDate);
            const days = differenceInDays(entryDate, firstVisitDate) % 7;

            return {
              date: format(entryDate, 'yyyy年M月d日(E)', { locale: ja }),
              treatmentPeriod: `${weeks}週${days}日`,
              content: entry.content,
              therapyMethods: entry.therapyMethods || [],
              nextAppointment: entry.nextAppointment 
                ? format(new Date(entry.nextAppointment), 'yyyy年M月d日(E)', { locale: ja })
                : null,
              modifiedAt: entry.modifiedAt 
                ? format(new Date(entry.modifiedAt), 'yyyy年M月d日 HH:mm:ss', { locale: ja })
                : null,
              modifiedReason: entry.modifiedReason || null,
              isDeleted: entry.isDeleted || false,
              deletedAt: entry.deletedAt 
                ? format(new Date(entry.deletedAt), 'yyyy年M月d日 HH:mm:ss', { locale: ja })
                : null,
              deleteReason: entry.deleteReason || null
            };
          }) || []
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('JSON generation failed:', error);
      throw new Error('JSONの生成に失敗しました');
    }
  }
}