export type RecordKind = "lab" | "prescription" | "hospital";
export type MedicalRecord = {
  id: string;
  date: string;
  title: string;
  titleBn: string;
  kind: RecordKind;
  provider: string;
  finding: string;
  explanation: string;
  explanationBn: string;
  fileName: string;
  verified: boolean;
  hemoglobin?: number;
  medicine?: string;
  diagnosis?: string;
  isUploaded?: boolean;
};

export const sampleRecords: MedicalRecord[] = [
  {
    id: "cbc-aug",
    date: "2026-08-18",
    title: "Complete blood count",
    titleBn: "সম্পূর্ণ রক্ত পরীক্ষা",
    kind: "lab",
    provider: "Popular Diagnostic Centre",
    finding: "Hemoglobin · 11.2 g/dL",
    explanation:
      "Hemoglobin is lower than in the January and March reports. A summary of all three results is ready for your doctor to review.",
    explanationBn:
      "জানুয়ারি ও মার্চের তুলনায় হিমোগ্লোবিন কমেছে। তিনটি রিপোর্টের সারাংশ আপনার ডাক্তারের পর্যালোচনার জন্য প্রস্তুত।",
    fileName: "CBC_August_2026.pdf",
    verified: false,
    hemoglobin: 11.2,
  },
  {
    id: "rx-apr",
    date: "2026-04-06",
    title: "Follow-up prescription",
    titleBn: "ফলো-আপ প্রেসক্রিপশন",
    kind: "prescription",
    provider: "Dr. Farhana Ahmed · Internal medicine",
    finding: "Follow-up in 6 weeks · medication recorded",
    explanation:
      "This prescription is connected to your earlier blood investigations. Medication details should be confirmed against the original prescription.",
    explanationBn:
      "এই প্রেসক্রিপশনটি আগের রক্ত পরীক্ষার সঙ্গে যুক্ত। ওষুধের তথ্য মূল প্রেসক্রিপশনের সঙ্গে মিলিয়ে নিন।",
    fileName: "Prescription_April_2026.pdf",
    verified: true,
    medicine: "Ferrous sulfate · as recorded in sample",
  },
  {
    id: "cbc-mar",
    date: "2026-03-12",
    title: "Complete blood count",
    titleBn: "সম্পূর্ণ রক্ত পরীক্ষা",
    kind: "lab",
    provider: "Ibn Sina Diagnostic Centre",
    finding: "Hemoglobin · 12.1 g/dL",
    explanation:
      "This result adds a second data point to your blood health history. The original report remains linked to this record.",
    explanationBn:
      "এই রিপোর্ট আপনার রক্তের স্বাস্থ্য ইতিহাসে নতুন তথ্য যোগ করেছে। মূল রিপোর্ট এই রেকর্ডের সঙ্গে সংযুক্ত আছে।",
    fileName: "CBC_March_2026.pdf",
    verified: true,
    hemoglobin: 12.1,
  },
  {
    id: "blood-jan",
    date: "2026-01-14",
    title: "Blood investigation",
    titleBn: "রক্ত পরীক্ষা",
    kind: "lab",
    provider: "Square Hospital, Dhaka",
    finding: "Hemoglobin · 13.4 g/dL",
    explanation:
      "Your first blood investigation of 2026 provides a reference for comparing later results.",
    explanationBn:
      "২০২৬ সালের প্রথম রক্ত পরীক্ষা পরের রিপোর্টগুলোর সঙ্গে তুলনা করার ভিত্তি তৈরি করেছে।",
    fileName: "Blood_Investigation_January.pdf",
    verified: true,
    hemoglobin: 13.4,
  },
  {
    id: "sensitivity-2018",
    date: "2018-11-22",
    title: "Antibiotic sensitivity report",
    titleBn: "অ্যান্টিবায়োটিক সংবেদনশীলতা রিপোর্ট",
    kind: "lab",
    provider: "Labaid Diagnostic, Dhaka",
    finding: "Culture & sensitivity · historical record",
    explanation:
      "A historical culture report, preserved for future clinical context. This does not establish a current infection or a medication recommendation.",
    explanationBn:
      "ভবিষ্যৎ চিকিৎসার জন্য সংরক্ষিত পুরোনো কালচার রিপোর্ট। এটি বর্তমান সংক্রমণ বা ওষুধের পরামর্শ নয়।",
    fileName: "Culture_Sensitivity_2018.pdf",
    verified: true,
  },
];

export function formatDate(date: string, language: "en" | "bn", short = false) {
  return new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: short ? "short" : "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export async function storeOriginal(id: string, file: File): Promise<void> {
  const db = await openFiles();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction("files", "readwrite");
      transaction.objectStore("files").put(file, id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
}

export async function getOriginal(id: string): Promise<Blob | undefined> {
  const db = await openFiles();
  try {
    return await new Promise<Blob | undefined>((resolve, reject) => {
      const request = db
        .transaction("files", "readonly")
        .objectStore("files")
        .get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

function openFiles(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("nira-original-documents", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("files");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
