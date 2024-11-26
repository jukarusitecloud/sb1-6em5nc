import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { usePatients } from '../contexts/PatientContext';

const routeNames: Record<string, string> = {
  '': 'ホーム',
  'active-patients': '通院患者一覧',
  'treatment-records': '治療記録',
  'new-registration': '新規患者登録',
  'chart': 'カルテ記入',
  'settings': '設定',
  'therapy': '物理療法設定',
  'templates': '定型文設定',
  'reminders': 'リマインド設定'
};

export default function NavigationBreadcrumb() {
  const location = useLocation();
  const { patientId } = useParams();
  const { getPatient } = usePatients();
  const pathnames = location.pathname.split('/').filter(x => x);

  // 患者情報を取得
  const patient = patientId ? getPatient(patientId) : null;

  const getBreadcrumbItems = () => {
    const items = [];
    let currentPath = '';

    for (let i = 0; i < pathnames.length; i++) {
      const name = pathnames[i];
      currentPath += `/${name}`;

      // patientIdの場合は患者名を表示
      if (name === patientId && patient) {
        items.push({
          name: `${patient.lastName} ${patient.firstName}`,
          path: currentPath,
          isPatient: true
        });
        continue;
      }

      // settings配下の場合
      if (name === 'settings') {
        continue; // settingsは表示しない
      }

      if (['therapy', 'templates', 'reminders'].includes(name) && pathnames[i-1] === 'settings') {
        items.push({
          name: routeNames[name],
          path: currentPath,
          isLast: i === pathnames.length - 1
        });
        continue;
      }

      // 通常のルート
      if (routeNames[name]) {
        items.push({
          name: routeNames[name],
          path: currentPath,
          isLast: i === pathnames.length - 1
        });
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav className="bg-white border-b border-mono-200 px-6 py-3">
      <ol className="flex items-center space-x-2">
        <li>
          <Link 
            to="/"
            className="text-mono-500 hover:text-mono-900 transition-colors flex items-center gap-1"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">ホーム</span>
          </Link>
        </li>
        
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <ChevronRight className="h-4 w-4 text-mono-400" />
            <li>
              {item.isLast ? (
                <span className="text-mono-900 font-medium">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className={`transition-colors ${
                    item.isPatient 
                      ? 'text-blue-600 hover:text-blue-800'
                      : 'text-mono-500 hover:text-mono-900'
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}