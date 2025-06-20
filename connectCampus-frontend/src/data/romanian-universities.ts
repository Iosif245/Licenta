export interface University {
  id: number;
  name: string;
  faculties?: string[];
}

export interface Faculty {
  id: number;
  name: string;
}

// Common Romanian faculties that can be used across universities
export const COMMON_FACULTIES: Faculty[] = [
  // Științe exacte și naturale
  { id: 1, name: 'Facultatea de Matematică' },
  { id: 2, name: 'Facultatea de Informatică' },
  { id: 3, name: 'Facultatea de Matematică și Informatică' },
  { id: 4, name: 'Facultatea de Fizică' },
  { id: 5, name: 'Facultatea de Chimie' },
  { id: 6, name: 'Facultatea de Biologie' },
  { id: 7, name: 'Facultatea de Geologie și Geofizică' },
  { id: 8, name: 'Facultatea de Geografie' },
  { id: 9, name: 'Facultatea de Științe ale Mediului' },
  
  // Inginerie și tehnologie
  { id: 10, name: 'Facultatea de Automatică și Calculatoare' },
  { id: 11, name: 'Facultatea de Electronică, Telecomunicații și Tehnologia Informației' },
  { id: 12, name: 'Facultatea de Inginerie Electrică' },
  { id: 13, name: 'Facultatea de Inginerie Mecanică și Mecatronică' },
  { id: 14, name: 'Facultatea de Inginerie Chimică și Biotehnologii' },
  { id: 15, name: 'Facultatea de Inginerie Civilă' },
  { id: 16, name: 'Facultatea de Construcții' },
  { id: 17, name: 'Facultatea de Arhitectură și Urbanism' },
  { id: 18, name: 'Facultatea de Inginerie Aerospațială' },
  { id: 19, name: 'Facultatea de Inginerie Navală' },
  { id: 20, name: 'Facultatea de Inginerie Geologică și Petrolieră' },
  { id: 21, name: 'Facultatea de Inginerie Minieră' },
  { id: 22, name: 'Facultatea de Inginerie Energetică' },
  { id: 23, name: 'Facultatea de Inginerie Textilă și Pielărie' },
  { id: 24, name: 'Facultatea de Inginerie Alimentară' },
  { id: 25, name: 'Facultatea de Inginerie Medicală' },
  { id: 26, name: 'Facultatea de Inginerie de Sisteme' },
  { id: 27, name: 'Facultatea de Inginerie Industrială și Robotică' },
  
  // Medicină și sănătate
  { id: 28, name: 'Facultatea de Medicină' },
  { id: 29, name: 'Facultatea de Medicină Dentară' },
  { id: 30, name: 'Facultatea de Farmacie' },
  { id: 31, name: 'Facultatea de Medicină Veterinară' },
  { id: 32, name: 'Facultatea de Asistență Medicală' },
  { id: 33, name: 'Facultatea de Moașe și Asistență Medicală' },
  { id: 34, name: 'Facultatea de Kinetoterapie și Motricitate Specială' },
  { id: 35, name: 'Facultatea de Sănătate Publică' },
  
  // Economie și business
  { id: 36, name: 'Facultatea de Științe Economice' },
  { id: 37, name: 'Facultatea de Economie și Administrarea Afacerilor' },
  { id: 38, name: 'Facultatea de Finanțe și Bănci' },
  { id: 39, name: 'Facultatea de Contabilitate și Informatică de Gestiune' },
  { id: 40, name: 'Facultatea de Marketing' },
  { id: 41, name: 'Facultatea de Management' },
  { id: 42, name: 'Facultatea de Comerț' },
  { id: 43, name: 'Facultatea de Turism și Geografie Comercială' },
  { id: 44, name: 'Facultatea de Administrație și Afaceri' },
  { id: 45, name: 'Facultatea de Economie Agroalimentară și a Mediului' },
  
  // Drept și științe politice
  { id: 46, name: 'Facultatea de Drept' },
  { id: 47, name: 'Facultatea de Științe Politice' },
  { id: 48, name: 'Facultatea de Administrație Publică' },
  { id: 49, name: 'Facultatea de Relații Internaționale și Studii Europene' },
  { id: 50, name: 'Facultatea de Comunicare și Relații Publice' },
  
  // Științe sociale și umane
  { id: 51, name: 'Facultatea de Sociologie și Asistență Socială' },
  { id: 52, name: 'Facultatea de Psihologie și Științele Educației' },
  { id: 53, name: 'Facultatea de Filosofie' },
  { id: 54, name: 'Facultatea de Istorie' },
  { id: 55, name: 'Facultatea de Litere' },
  { id: 56, name: 'Facultatea de Limbi și Literaturi Străine' },
  { id: 57, name: 'Facultatea de Jurnalism și Științele Comunicării' },
  { id: 58, name: 'Facultatea de Științele Educației' },
  { id: 59, name: 'Facultatea de Pedagogie' },
  
  // Arte și cultură
  { id: 60, name: 'Facultatea de Arte Plastice, Decorative și Design' },
  { id: 61, name: 'Facultatea de Arte Vizuale și Design' },
  { id: 62, name: 'Facultatea de Muzică' },
  { id: 63, name: 'Facultatea de Teatru și Film' },
  { id: 64, name: 'Facultatea de Coregrafie' },
  { id: 65, name: 'Facultatea de Arte și Design' },
  
  // Sport și educație fizică
  { id: 66, name: 'Facultatea de Educație Fizică și Sport' },
  { id: 67, name: 'Facultatea de Kinesiologie' },
  
  // Teologie
  { id: 68, name: 'Facultatea de Teologie Ortodoxă' },
  { id: 69, name: 'Facultatea de Teologie Catolică' },
  { id: 70, name: 'Facultatea de Teologie Protestantă' },
  { id: 71, name: 'Facultatea de Teologie Reformată' },
  { id: 72, name: 'Facultatea de Teologie Baptiste' },
  
  // Agricultură și silvicultură
  { id: 73, name: 'Facultatea de Agricultură' },
  { id: 74, name: 'Facultatea de Horticultură' },
  { id: 75, name: 'Facultatea de Silvicultură și Exploatări Forestiere' },
  { id: 76, name: 'Facultatea de Zootehnie și Biotehnologii' },
  { id: 77, name: 'Facultatea de Inginerie și Management în Agricultură și Dezvoltare Rurală' },
  
  // Științe militare și securitate
  { id: 78, name: 'Facultatea de Științe Militare' },
  { id: 79, name: 'Facultatea de Informații' },
  { id: 80, name: 'Facultatea de Ordine Publică' },
  { id: 81, name: 'Facultatea de Pompieri' },
  
  // Alte domenii
  { id: 82, name: 'Facultatea de Transporturi' },
  { id: 83, name: 'Facultatea de Științe Nautice' },
  { id: 84, name: 'Facultatea de Biblioteconomie și Științele Informării' },
  { id: 85, name: 'Facultatea de Studii Europene' },
  { id: 86, name: 'Facultatea de Științe Aplicate' },
  { id: 87, name: 'Facultatea de Științe Integrate' },
];

export interface Specialization {
  id: number;
  name: string;
}

export const ROMANIAN_UNIVERSITIES: University[] = [
  { id: 1, name: 'Universitatea Politehnica din Bucureşti' },
  { id: 2, name: 'Universitatea Tehnică de Construcţii din Bucureşti' },
  { id: 3, name: 'Universitatea de Arhitectură şi Urbanism "Ion Mincu" din Bucureşti' },
  { id: 4, name: 'Universitatea de Ştiințe Agronomice și Medicină Veterinară din București' },
  { id: 5, name: 'Universitatea din Bucureşti' },
  { id: 6, name: 'Universitatea de Medicină şi Farmacie "Carol Davila" din Bucureşti' },
  { id: 7, name: 'Academia de Studii Economice din Bucureşti' },
  { id: 8, name: 'Universitatea Naţională de Muzică din Bucureşti' },
  { id: 9, name: 'Universitatea Naţională de Arte din Bucureşti' },
  { id: 10, name: 'Universitatea Naţională de Artă Teatrală şi Cinematografică "I. L. Caragiale" din Bucureşti' },
  { id: 11, name: 'Universitatea Naţională de Educaţie Fizică şi Sport din Bucureşti' },
  { id: 12, name: 'Şcoala Naţională de Studii Politice şi Administrative din Bucureşti' },
  { id: 13, name: 'Universitatea "1 Decembrie 1918" din Alba Iulia' },
  { id: 14, name: 'Universitatea "Aurel Vlaicu" din Arad' },
  { id: 15, name: 'Universitatea "Vasile Alecsandri" din Bacău' },
  { id: 16, name: 'Universitatea "Transilvania" din Braşov' },
  { id: 17, name: 'Universitatea Tehnică din Cluj-Napoca' },
  { id: 18, name: 'Universitatea de Ştiinţe Agricole şi Medicină Veterinară din Cluj-Napoca' },
  { id: 19, name: 'Universitatea "Babeş-Bolyai" din Cluj-Napoca' },
  { id: 20, name: 'Universitatea de Medicină şi Farmacie "Iuliu Haţieganu" din Cluj-Napoca' },
  { id: 21, name: 'Academia de Muzică "Gheorghe Dima" din Cluj-Napoca' },
  { id: 22, name: 'Universitatea de Artă şi Design din Cluj-Napoca' },
  { id: 23, name: 'Universitatea "Ovidius" din Constanţa' },
  { id: 24, name: 'Universitatea Maritimă din Constanţa' },
  { id: 25, name: 'Universitatea din Craiova' },
  { id: 26, name: 'Universitatea de Medicină şi Farmacie din Craiova' },
  { id: 27, name: 'Universitatea "Dunărea de Jos" din Galaţi' },
  { id: 28, name: 'Universitatea Tehnică "Gheorghe Asachi" din Iaşi' },
  { id: 29, name: 'Universitatea de Ştiinţe Agricole şi Medicină Veterinară "Ion Ionescu de La Brad" din Iaşi' },
  { id: 30, name: 'Universitatea "Alexandru Ioan Cuza" din Iaşi' },
  { id: 31, name: 'Universitatea din Oradea' },
  { id: 32, name: 'Universitatea din Petroşani' },
  { id: 33, name: 'Universitatea din Piteşti' },
  { id: 34, name: 'Universitatea Petrol-Gaze din Ploieşti' },
  { id: 35, name: 'Universitatea "Eftimie Murgu" din Reşiţa' },
  { id: 36, name: 'Universitatea "Lucian Blaga" din Sibiu' },
  { id: 37, name: 'Universitatea "Ştefan cel Mare" din Suceava' },
  { id: 38, name: 'Universitatea "Valahia" din Târgovişte' },
  { id: 39, name: 'Universitatea "Constantin Brâncuşi" din Târgu Jiu' },
  { id: 40, name: 'Universitatea "Petru Maior" din Târgu Mureş' },
  { id: 41, name: 'Universitatea de Arte din Târgu Mureş' },
  { id: 42, name: 'Universitatea Politehnica Timişoara' },
  { id: 43, name: 'Universitatea de Ştiinţe Agricole şi Medicină Veterinară a Banatului "Regele Mihai I al României" din Timişoara' },
  { id: 44, name: 'Universitatea de Vest din Timişoara' },
  { id: 45, name: 'Universitatea de Medicină şi Farmacie "Victor Babeş" din Timişoara' },
  { id: 46, name: 'Universitatea Naţională de Apărare "Carol I" din Bucureşti' },
  { id: 47, name: 'Academia Naţională de Informaţii "Mihai Viteazul" din Bucureşti' },
  { id: 48, name: 'Academia de Poliţie "Alexandru Ioan Cuza" din Bucureşti' },
  { id: 49, name: 'Academia Forţelor Aeriene "Henri Coandă" din Braşov' },
  { id: 50, name: 'Academia Navală "Mircea cel Bătrân" din Constanţa' },
  { id: 51, name: 'Academia Forţelor Terestre "Nicolae Bălcescu" din Sibiu' },
  { id: 52, name: 'Universitatea Creştină "Dimitrie Cantemir" din Bucureşti' },
  { id: 53, name: 'Universitatea "Titu Maiorescu" din Bucureşti' },
  { id: 54, name: 'Universitatea "Nicolae Titulescu" din Bucureşti' },
  { id: 55, name: 'Universitatea Româno-Americană din Bucureşti' },
  { id: 56, name: 'Universitatea "Hyperion" din Bucureşti' },
  { id: 57, name: 'Universitatea "Spiru Haret" din Bucureşti' },
  { id: 58, name: 'Universitatea "Bioterra" din Bucureşti' },
  { id: 59, name: 'Universitatea Ecologică din Bucureşti' },
  { id: 60, name: 'Universitatea Română de Ştiinţe şi Arte "Gheorghe Cristea" din Bucureşti' },
  { id: 61, name: 'Universitatea "Athenaeum" din Bucureşti' },
  { id: 62, name: 'Universitatea "Artifex" din Bucureşti' },
  { id: 63, name: 'Institutul Teologic Baptist din Bucureşti' },
  { id: 64, name: 'Universitatea de Vest "Vasile Goldiş" din Arad' },
  { id: 65, name: 'Universitatea "George Bacovia" din Bacău' },
  { id: 66, name: 'Universitatea "George Bariţiu" din Braşov' },
  { id: 67, name: 'Universitatea "Bogdan Vodă" din Cluj-Napoca' },
  { id: 68, name: 'Universitatea "Andrei Şaguna" din Constanţa' },
  { id: 69, name: 'Universitatea "Danubius" din Galaţi' },
  { id: 70, name: 'Universitatea Europeană "Drăgan" din Lugoj' },
  { id: 71, name: 'Universitatea "Emanuel" din Oradea' },
  { id: 72, name: 'Universitatea "Constantin Brâncoveanu" din Piteşti' },
  { id: 73, name: 'Universitatea "Româno-Germană" din Sibiu' },
  { id: 74, name: 'Universitatea "Dimitrie Cantemir" din Târgu Mureş' },
  { id: 75, name: 'Universitatea "Tibiscus" din Timişoara' },
  { id: 76, name: 'Universitatea "Avram Iancu" din Cluj-Napoca' },
  { id: 77, name: 'Institutul Teologic Penticostal din Bucureşti' },
  { id: 78, name: 'Universitatea Creştină "Partium" din Oradea' },
  { id: 79, name: 'Universitatea "Petre Andrei" din Iaşi' },
  { id: 80, name: 'Universitatea "Apollonia" din Iaşi' },
  { id: 81, name: 'Institutul de Administrare a Afacerilor din Bucureşti' },
  { id: 82, name: 'Institutul Teologic Protestant din Cluj-Napoca' },
  { id: 83, name: 'Universitatea "Sapientia" din Cluj-Napoca' },
  { id: 84, name: 'Fundaţia "Ştefan Lupaşcu" - Institutul de Studii Europene din Iaşi' },
  { id: 85, name: 'Institutul Teologic Romano-Catolic din Iaşi' },
  { id: 86, name: 'Universitatea Agora din Municipiul Oradea' },
  { id: 87, name: 'Institutul Teologic Romano-Catolic Franciscan din Roman' },
  { id: 88, name: 'Fundaţia pentru Cultură şi Învăţământ "Ioan Slavici" - Universitatea "Ioan Slavici" din Timişoara' },
  { id: 89, name: 'Fundaţia "Gaudeamus" - Universitatea "Tomis" din Constanţa' },
  { id: 90, name: 'Institutul Teologic Creştin după Evanghelie "Timotheus" din Bucureşti' },
  { id: 91, name: 'Fundaţia Lumina - Instituţii de Învăţământ - Universitatea Europei de Sud Est-Lumina' },
  { id: 92, name: 'Academia Română' },
  { id: 93, name: 'Universitatea Naţională de Arte "George Enescu" din Iaşi' },
  { id: 94, name: 'Şcoala Normală Superioară - Bucureşti (S.N.S.B)' },
  { id: 95, name: 'Universitatea "Adventus" din Cernica' },
  { id: 96, name: 'Academia Tehnică Militară "Ferdinand I" din București' },
  { id: 97, name: 'Universitatea de Medicină, Farmacie, Științe și Tehnologie "George Emil Palade" din Târgu Mureș' },
  { id: 98, name: 'Universitatea de Medicină şi Farmacie "Grigore T. Popa" din Iaşi' },
];

export const SPECIALIZATIONS: Specialization[] = [
  // Medicină și sănătate
  { id: 1, name: 'Medicină' },
  { id: 2, name: 'Medicină dentară' },
  { id: 3, name: 'Farmacie' },
  { id: 4, name: 'Medicină veterinară' },
  { id: 5, name: 'Asistență medicală generală' },
  { id: 6, name: 'Asistență medicală comunitară' },
  { id: 7, name: 'Moașe' },
  { id: 8, name: 'Balneofiziokinetoterapie și recuperare' },
  { id: 9, name: 'Kinetoterapie și motricitate specială' },
  { id: 10, name: 'Nutriție și dietetică' },
  { id: 11, name: 'Radiologie și imagistică medicală' },
  { id: 12, name: 'Laborator medical' },
  { id: 13, name: 'Sănătate publică și management' },
  { id: 14, name: 'Optometrie' },
  { id: 15, name: 'Proteze dentare' },

  // Informatică și tehnologie
  { id: 16, name: 'Informatică' },
  { id: 17, name: 'Calculatoare și tehnologia informației' },
  { id: 18, name: 'Inginerie software' },
  { id: 19, name: 'Sisteme informatice' },
  { id: 20, name: 'Tehnologia informației' },
  { id: 21, name: 'Securitatea sistemelor informatice' },
  { id: 22, name: 'Inteligență artificială' },
  { id: 23, name: 'Știința datelor' },
  { id: 24, name: 'Robotică și sisteme inteligente' },
  { id: 25, name: 'Dezvoltarea aplicațiilor web și mobile' },

  // Inginerie
  { id: 26, name: 'Inginerie civilă' },
  { id: 27, name: 'Inginerie mecanică' },
  { id: 28, name: 'Inginerie electrică' },
  { id: 29, name: 'Inginerie electronică și telecomunicații' },
  { id: 30, name: 'Automatică și informatică aplicată' },
  { id: 31, name: 'Inginerie chimică' },
  { id: 32, name: 'Inginerie alimentară' },
  { id: 33, name: 'Inginerie agricolă' },
  { id: 34, name: 'Inginerie forestieră' },
  { id: 35, name: 'Inginerie geologică' },
  { id: 36, name: 'Inginerie minieră' },
  { id: 37, name: 'Inginerie petrolieră și gaze' },
  { id: 38, name: 'Inginerie textilă și pielărie' },
  { id: 39, name: 'Inginerie aerospațială' },
  { id: 40, name: 'Inginerie navală' },
  { id: 41, name: 'Inginerie energetică' },
  { id: 42, name: 'Inginerie medicală' },
  { id: 43, name: 'Inginerie de sisteme' },
  { id: 44, name: 'Inginerie industrială și management' },
  { id: 45, name: 'Mecatronică' },
  { id: 46, name: 'Arhitectură' },
  { id: 47, name: 'Urbanism' },
  { id: 48, name: 'Construcții civile, industriale și agricole' },
  { id: 49, name: 'Instalații pentru construcții' },
  { id: 50, name: 'Căi ferate, drumuri și poduri' },

  // Economie și business
  { id: 51, name: 'Economie generală' },
  { id: 52, name: 'Economie și afaceri internaționale' },
  { id: 53, name: 'Finanțe și bănci' },
  { id: 54, name: 'Finanțe și asigurări' },
  { id: 55, name: 'Contabilitate și informatică de gestiune' },
  { id: 56, name: 'Marketing' },
  { id: 57, name: 'Management' },
  { id: 58, name: 'Administrarea afacerilor' },
  { id: 59, name: 'Comerț, turism și servicii' },
  { id: 60, name: 'Turism și servicii' },
  { id: 61, name: 'Economia comerțului, turismului și serviciilor' },
  { id: 62, name: 'Resurse umane' },
  { id: 63, name: 'Logistică economică' },
  { id: 64, name: 'Economia și administrarea afacerilor' },
  { id: 65, name: 'Economie agroalimentară și a mediului' },

  // Științe exacte și naturale
  { id: 66, name: 'Matematică' },
  { id: 67, name: 'Matematică informatică' },
  { id: 68, name: 'Statistică' },
  { id: 69, name: 'Fizică' },
  { id: 70, name: 'Fizică medicală' },
  { id: 71, name: 'Chimie' },
  { id: 72, name: 'Chimie aplicată' },
  { id: 73, name: 'Biologie' },
  { id: 74, name: 'Biochimie' },
  { id: 75, name: 'Biotehnologii' },
  { id: 76, name: 'Ecologie și protecția mediului' },
  { id: 77, name: 'Geografie' },
  { id: 78, name: 'Geologie' },
  { id: 79, name: 'Geofizică' },
  { id: 80, name: 'Meteorologie' },

  // Drept și științe politice
  { id: 81, name: 'Drept' },
  { id: 82, name: 'Științe politice' },
  { id: 83, name: 'Administrație publică' },
  { id: 84, name: 'Relații internaționale și studii europene' },
  { id: 85, name: 'Comunicare și relații publice' },
  { id: 86, name: 'Științe administrative' },
  { id: 87, name: 'Securitate națională' },

  // Științe sociale și umane
  { id: 88, name: 'Sociologie' },
  { id: 89, name: 'Asistență socială' },
  { id: 90, name: 'Psihologie' },
  { id: 91, name: 'Științele educației' },
  { id: 92, name: 'Pedagogie' },
  { id: 93, name: 'Educația copilului mic' },
  { id: 94, name: 'Filosofie' },
  { id: 95, name: 'Istorie' },
  { id: 96, name: 'Arheologie' },
  { id: 97, name: 'Istoria artei' },
  { id: 98, name: 'Muzeologie' },
  { id: 99, name: 'Arhivistică' },

  // Litere și limbi străine
  { id: 100, name: 'Limba și literatura română' },
  { id: 101, name: 'Limba și literatura engleză' },
  { id: 102, name: 'Limba și literatura franceză' },
  { id: 103, name: 'Limba și literatura germană' },
  { id: 104, name: 'Limba și literatura spaniolă' },
  { id: 105, name: 'Limba și literatura italiană' },
  { id: 106, name: 'Limba și literatura rusă' },
  { id: 107, name: 'Limba și literatura maghiară' },
  { id: 108, name: 'Filologie clasică' },
  { id: 109, name: 'Lingvistică' },
  { id: 110, name: 'Traducere și interpretariat' },
  { id: 111, name: 'Limbi moderne aplicate' },

  // Jurnalism și comunicare
  { id: 112, name: 'Jurnalism' },
  { id: 113, name: 'Comunicare și relații publice' },
  { id: 114, name: 'Științele comunicării' },
  { id: 115, name: 'Publicitate' },
  { id: 116, name: 'Media și comunicare' },

  // Arte și design
  { id: 117, name: 'Arte plastice' },
  { id: 118, name: 'Arte decorative' },
  { id: 119, name: 'Design' },
  { id: 120, name: 'Design grafic' },
  { id: 121, name: 'Design industrial' },
  { id: 122, name: 'Design vestimentar' },
  { id: 123, name: 'Arte vizuale' },
  { id: 124, name: 'Fotografie' },
  { id: 125, name: 'Cinematografie' },
  { id: 126, name: 'Artă monumentală' },

  // Muzică și arte spectacolului
  { id: 127, name: 'Muzică' },
  { id: 128, name: 'Interpretare muzicală' },
  { id: 129, name: 'Compoziție muzicală' },
  { id: 130, name: 'Muzicologie' },
  { id: 131, name: 'Actorie' },
  { id: 132, name: 'Regie' },
  { id: 133, name: 'Scenografie' },
  { id: 134, name: 'Coregrafie' },
  { id: 135, name: 'Dans contemporan' },
  { id: 136, name: 'Dans popular' },

  // Sport și educație fizică
  { id: 137, name: 'Educație fizică și sportivă' },
  { id: 138, name: 'Sport și performanță motrică' },
  { id: 139, name: 'Activități fizice adaptate' },
  { id: 140, name: 'Kinesiologie' },
  { id: 141, name: 'Management sportiv' },

  // Teologie
  { id: 142, name: 'Teologie ortodoxă' },
  { id: 143, name: 'Teologie catolică' },
  { id: 144, name: 'Teologie protestantă' },
  { id: 145, name: 'Teologie reformată' },
  { id: 146, name: 'Teologie baptistă' },
  { id: 147, name: 'Teologie penticostală' },
  { id: 148, name: 'Asistență religioasă' },

  // Agricultură și silvicultură
  { id: 149, name: 'Agricultură' },
  { id: 150, name: 'Horticultură' },
  { id: 151, name: 'Silvicultură' },
  { id: 152, name: 'Zootehnie' },
  { id: 153, name: 'Medicina veterinară' },
  { id: 154, name: 'Tehnologia produselor alimentare' },
  { id: 155, name: 'Ingineria și managementul sistemelor alimentare' },
  { id: 156, name: 'Protecția plantelor' },
  { id: 157, name: 'Ameliorarea plantelor' },
  { id: 158, name: 'Exploatări forestiere' },

  // Științe militare și securitate
  { id: 159, name: 'Științe militare' },
  { id: 160, name: 'Științe ale informațiilor' },
  { id: 161, name: 'Ordine publică' },
  { id: 162, name: 'Pompieri' },
  { id: 163, name: 'Securitate și protecție' },
  { id: 164, name: 'Management în situații de urgență' },

  // Transport și logistică
  { id: 165, name: 'Transporturi' },
  { id: 166, name: 'Inginerie navală' },
  { id: 167, name: 'Navigație și transport naval' },
  { id: 168, name: 'Logistică și transport' },
  { id: 169, name: 'Ingineria traficului' },

  // Alte specializări
  { id: 170, name: 'Biblioteconomie și științele informării' },
  { id: 171, name: 'Studii europene' },
  { id: 172, name: 'Științe aplicate' },
  { id: 173, name: 'Științe integrate' },
  { id: 174, name: 'Dezvoltare durabilă' },
  { id: 175, name: 'Inovație și antreprenoriat' },
];

// Helper functions
export function getUniversityById(id: number): University | undefined {
  return ROMANIAN_UNIVERSITIES.find(university => university.id === id);
}

export function getSpecializationById(id: number): Specialization | undefined {
  return SPECIALIZATIONS.find(specialization => specialization.id === id);
}

export function getUniversitiesByName(searchTerm: string): University[] {
  return ROMANIAN_UNIVERSITIES.filter(university => university.name.toLowerCase().includes(searchTerm.toLowerCase()));
}

export function getSpecializationsByName(searchTerm: string): Specialization[] {
  return SPECIALIZATIONS.filter(specialization => specialization.name.toLowerCase().includes(searchTerm.toLowerCase()));
}
