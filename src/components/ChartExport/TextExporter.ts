import { format, differenceInWeeks, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Patient } from '../../contexts/PatientContext';

export class TextExporter {
  public static async generate(patient: Patient): Promise<string> {
    try {
      let content = '';

      // ヘッダー
      content += '=== 診療記録 ===\n\n';

      // 患者情報
      content += '【患者情報】\n';
      content += `氏名: ${patient.lastName} ${patient.firstName}\n`;
      content += `フリガナ: ${patient.lastNameKana} ${patient.firstNameKana}\n`;
      content += `初診日: ${format(new Date(patient.firstVisitDate), 'yyyy年M月d日', { locale: ja })}\n\n`;

      // カルテ記録
      content += '【診療記録一覧】\n\n';

      if (patient.chartEntries && patient.chartEntries.length > 0) {
        const sortedEntries = [...patient.chartEntries].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        for (const entry of sortedEntries) {
          const entryDate = new Date(entry.date);
          const firstVisitDate = new Date(patient.firstVisitDate);
          const weeks = differenceInWeeks(entryDate, firstVisitDate);
          const days = differenceInDays(entryDate, firstVisitDate) % 7;

          content += `施術日: ${format(entryDate, 'yyyy年M月d日(E)', { locale: ja })}\n`;
          content += `初診からの期間: ${weeks}週${days}日\n`;
          content += '施術内容:\n';
          content += `${entry.content}\n`;

          if (entry.therapyMethods && entry.therapyMethods.length > 0) {
            content += `実施した物療: ${entry.therapyMethods.join('、')}\n`;
          }

          if (entry.nextAppointment) {
            content += `次回予約: ${format(new Date(entry.nextAppointment), 'yyyy年M月d日(E)', { locale: ja })}\n`;
          }

          content += '\n---\n\n';
        }
      } else {
        content += '診療記録はありません。\n';
      }

      return content;
    } catch (error) {
      console.error('Text generation failed:', error);
      throw new Error('テキストファイルの生成に失敗しました');
    }
  }
}