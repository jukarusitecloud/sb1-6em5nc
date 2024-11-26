import { format, differenceInWeeks, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Patient } from '../../contexts/PatientContext';

export class CSVExporter {
  private static escapeField(field: string | undefined | null): string {
    if (!field) return '""';
    return `"${field.replace(/"/g, '""')}"`;
  }

  public static async generate(patient: Patient): Promise<string> {
    try {
      let csvContent = '\ufeff'; // BOM for Excel
      
      // Patient info header
      csvContent += '患者情報\n';
      csvContent += `氏名,${this.escapeField(`${patient.lastName} ${patient.firstName}`)}\n`;
      csvContent += `フリガナ,${this.escapeField(`${patient.lastNameKana} ${patient.firstNameKana}`)}\n`;
      csvContent += `初診日,${format(new Date(patient.firstVisitDate), 'yyyy年M月d日', { locale: ja })}\n\n`;

      // Treatment records header
      csvContent += '診療記録\n';
      csvContent += '施術日,初診からの期間,施術内容,実施した物療,次回予約\n';

      // Data rows
      if (patient.chartEntries?.length) {
        patient.chartEntries
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .forEach((entry) => {
            const entryDate = new Date(entry.date);
            const firstVisitDate = new Date(patient.firstVisitDate);
            const weeks = differenceInWeeks(entryDate, firstVisitDate);
            const days = differenceInDays(entryDate, firstVisitDate) % 7;

            const date = format(entryDate, 'yyyy年M月d日(E)', { locale: ja });
            const period = `${weeks}週${days}日`;
            const content = this.escapeField(entry.content);
            const therapies = this.escapeField(entry.therapyMethods?.join('、'));
            const nextAppointment = entry.nextAppointment 
              ? format(new Date(entry.nextAppointment), 'yyyy年M月d日(E)', { locale: ja })
              : '';

            csvContent += `${date},${period},${content},${therapies},${nextAppointment}\n`;
          });
      }

      return csvContent;
    } catch (error) {
      console.error('CSV generation failed:', error);
      throw new Error('CSVの生成に失敗しました');
    }
  }
}