const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Curated Holy Spirit Scriptures & Declarations in English
const holySpiritMen = [
  {
    topic: 'holy_spirit',
    ref: 'Acts 1:8',
    verse: 'But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.',
    decl: 'I am baptized with supernatural power. The Holy Spirit empowers me to be a bold, unashamed witness for Jesus in my home, my city, and every sphere of influence.'
  },
  {
    topic: 'holy_spirit',
    ref: 'John 16:13',
    verse: 'But when he, the Spirit of truth, comes, he will guide you into all the truth. He will not speak on his own; he will speak only what he hears, and he will tell you what is yet to come.',
    decl: 'The Spirit of Truth guides my every step. I do not walk in confusion or second-guessing; the Holy Spirit illuminates my path and reveals God’s wisdom to my spirit.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Romans 8:14',
    verse: 'For those who are led by the Spirit of God are the children of God.',
    decl: 'I am a true son of the living God, led daily by His Holy Spirit. My flesh does not dictate my direction; the Spirit guides my impulses, decisions, and heart.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Romans 8:26',
    verse: 'In the same way, the Spirit helps us in our weakness. We do not know what we ought to pray for, but the Spirit himself intercedes for us through wordless groans.',
    decl: 'When I am weak or do not know what to pray, the Holy Spirit carries my petitions. His divine intercession aligns my prayers perfectly with the will of the Father.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Galatians 5:22-23',
    verse: 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.',
    decl: 'The character of Jesus flourishes within me. By the Holy Spirit, I walk in supernatural love, unshakeable joy, and masculine self-control in every pressure.'
  },
  {
    topic: 'holy_spirit',
    ref: '1 Corinthians 6:19-20',
    verse: 'Do you not know that your bodies are temples of the Holy Spirit, who is in you, whom you have received from God? You are not your own; you were bought at a price.',
    decl: 'My body is a holy sanctuary of the Spirit of God. I honor God with my eyes, my thoughts, and my physical strength, refusing every snare of impurity.'
  },
  {
    topic: 'holy_spirit',
    ref: '2 Timothy 1:7',
    verse: 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.',
    decl: 'Timidity and cowardice have no room in my soul. The Holy Spirit fuels me with holy courage, boundless agape love, and laser-sharp self-mastery.'
  },
  {
    topic: 'holy_spirit',
    ref: '2 Corinthians 3:17',
    verse: 'Now the Lord is the Spirit, and where the Spirit of the Lord is, there is freedom.',
    decl: 'Where the Spirit of the Lord is, there is absolute freedom. Every chain of addiction, fear, and condemnation is broken off my life today.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Luke 4:18-19',
    verse: 'The Spirit of the Lord is on me, because he has anointed me to proclaim good news to the poor. He has sent me to proclaim freedom for the prisoners and recovery of sight for the blind.',
    decl: 'The anointing of the Holy Spirit rests upon my life. I am empowered to proclaim liberty, bring healing to wounded hearts, and advance the Kingdom of God with authority.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Ephesians 1:13-14',
    verse: 'And you also were included in Christ when you heard the message of truth... having believed, you were marked in him with a seal, the promised Holy Spirit.',
    decl: 'I am sealed for eternity by the Holy Spirit of promise. My inheritance is guaranteed, my salvation is secure, and my identity in Christ is untouchable.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Isaiah 11:2',
    verse: 'The Spirit of the Lord will rest on him—the Spirit of wisdom and of understanding, the Spirit of counsel and of might, the Spirit of the knowledge and fear of the Lord.',
    decl: 'The sevenfold Spirit of God rests upon me: wisdom for decisions, understanding for complex matters, counsel in uncertainty, and supernatural might for the battle.'
  },
  {
    topic: 'holy_spirit',
    ref: 'John 7:38-39',
    verse: 'Whoever believes in me, as Scripture has said, rivers of living water will flow from within them. By this he meant the Spirit, whom those who believed in him were later to receive.',
    decl: 'Rivers of living water surge from my innermost being. The Holy Spirit refreshes my soul, revives my home, and brings spiritual vitality wherever I go.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Romans 15:13',
    verse: 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.',
    decl: 'I overflow with vibrant hope today through the power of the Holy Spirit. Despair is cast out, and divine optimism anchors my heart.'
  },
  {
    topic: 'holy_spirit',
    ref: '1 Corinthians 2:10-12',
    verse: 'These are the things God has revealed to us by his Spirit. The Spirit searches all things, even the deep things of God.',
    decl: 'The Holy Spirit searches the deep mysteries of the Father’s heart and reveals them to me. I receive heavenly insight, divine vision, and spiritual discernment.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Zechariah 4:6',
    verse: 'Not by might nor by power, but by my Spirit, says the Lord Almighty.',
    decl: 'The mountains before me will not fall by human striving or raw muscle, but by the breath and power of the Holy Spirit. God is making a smooth way forward.'
  }
];

const holySpiritWomen = [
  {
    topic: 'holy_spirit',
    ref: 'John 14:26',
    verse: 'But the Advocate, the Holy Spirit, whom the Father will send in my name, will teach you all things and will remind you of everything I have said to you.',
    decl: 'The Holy Spirit is my personal Advocate and Comforter. He teaches me divine truth, whispers peace to my soul, and constantly reminds me of Jesus’ tender promises.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Romans 8:15-16',
    verse: 'The Spirit you received brought about your adoption to sonship. And by him we cry, "Abba, Father." The Spirit himself testifies with our spirit that we are God’s children.',
    decl: 'I am a deeply cherished daughter of the King. The Holy Spirit constantly affirms within my spirit that I am loved, accepted, and forever secure in my Father’s arms.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Galatians 5:22-23',
    verse: 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.',
    decl: 'The fragrant fruit of the Spirit adorns my life today. I overflow with Christlike kindness, gentle strength, unshakeable peace, and patient grace in my home and workplace.'
  },
  {
    topic: 'holy_spirit',
    ref: '2 Corinthians 3:18',
    verse: 'And we all, who with unveiled faces contemplate the Lord’s glory, are being transformed into his image with ever-increasing glory, which comes from the Lord, who is the Spirit.',
    decl: 'As I gaze upon Jesus, the Holy Spirit transforms me from glory to glory. Past wounds, insecurity, and shame are swallowed up in His radiant beauty.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Titus 3:5',
    verse: 'He saved us, not because of righteous things we had done, but because of his mercy. He saved us through the washing of rebirth and renewal by the Holy Spirit.',
    decl: 'I am washed clean and daily renewed by the precious Holy Spirit. His grace makes all things fresh, pure, and full of divine hope in my life.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Romans 5:5',
    verse: 'And hope does not put us to shame, because God’s love has been poured out into our hearts through the Holy Spirit, who has been given to us.',
    decl: 'The lavish, unconditional love of God is poured out lavishly into my heart by the Holy Spirit. Fear of rejection has no power over my thoughts.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Psalm 143:10',
    verse: 'Teach me to do your will, for you are my God; may your good Spirit lead me on level ground.',
    decl: 'The gentle Holy Spirit leads my steps onto level ground. When the terrain seems steep or uncertain, His hand guides me safely and securely.'
  },
  {
    topic: 'holy_spirit',
    ref: '1 Corinthians 12:7',
    verse: 'Now to each one the manifestation of the Spirit is given for the common good.',
    decl: 'The Holy Spirit has uniquely gifted me with heavenly grace and wisdom. I steward my gifts to build up others, bring life, and glorify my Savior.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Ephesians 3:16',
    verse: 'I pray that out of his glorious riches he may strengthen you with power through his Spirit in your inner being.',
    decl: 'I am strengthened with supernatural power by the Holy Spirit in my inner being. Fatigue cannot drain my soul; His joy is my eternal resilience.'
  },
  {
    topic: 'holy_spirit',
    ref: 'John 14:16-17',
    verse: 'And I will ask the Father, and he will give you another advocate to help you and be with you forever—the Spirit of truth.',
    decl: 'I will never walk alone. The Holy Spirit dwells inside me as an eternal Companion, Wise Counselor, and Faithful Guardian through every season.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Luke 1:35',
    verse: 'The angel answered, "The Holy Spirit will come on you, and the power of the Most High will overshadow you."',
    decl: 'The Holy Spirit overshadows my life with His power and peace. What seems impossible in the natural will come to pass by His divine intervention.'
  },
  {
    topic: 'holy_spirit',
    ref: '2 Corinthians 13:14',
    verse: 'May the grace of the Lord Jesus Christ, and the love of God, and the fellowship of the Holy Spirit be with you all.',
    decl: 'I walk in intimate fellowship with the Holy Spirit today. His sweet communion fills my morning, anchors my afternoon, and comforts my night.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Romans 8:11',
    verse: 'And if the Spirit of him who raised Jesus from the dead is living in you, he who raised Christ from the dead will also give life to your mortal bodies because of his Spirit who lives in you.',
    decl: 'Resurrection life pulses through my mind, body, and spirit. The same Spirit who raised Jesus from the grave revitalizes every cell of my body and every dream in my heart.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Isaiah 61:1',
    verse: 'The Spirit of the Sovereign Lord is on me, because the Lord has anointed me to proclaim good news to the poor. He has sent me to bind up the brokenhearted.',
    decl: 'Anointed by the Spirit of the Sovereign Lord, I am a vessel of comfort and healing. My words carry peace to the brokenhearted and light to the weary.'
  },
  {
    topic: 'holy_spirit',
    ref: 'Acts 9:31',
    verse: 'Then the church... was strengthened. Living in the fear of the Lord and encouraged by the Holy Spirit, it increased in numbers.',
    decl: 'My home and family are built up in the fear of the Lord and daily comforted by the Holy Spirit. We walk in divine unity, peace, and spiritual growth.'
  }
];

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
}

async function main() {
  console.log('Loading devotionals-365.json...');
  const devJsonPath = path.join(__dirname, '..', 'src', 'seeds', 'devotionals-365.json');
  const rawDevs = JSON.parse(fs.readFileSync(devJsonPath, 'utf8'));
  console.log(`Loaded ${rawDevs.length} devotionals.`);

  console.log('Loading declarations-365.json...');
  const declJsonPath = path.join(__dirname, '..', 'src', 'seeds', 'declarations-365.json');
  const rawDecls = JSON.parse(fs.readFileSync(declJsonPath, 'utf8'));

  // Ensure Holy Spirit declarations are heavily woven into both men and women (at least every 4-5 days)
  let hombresDecls = [...(rawDecls.hombres || [])];
  let mujeresDecls = [...(rawDecls.mujeres || [])];

  for (let i = 0; i < hombresDecls.length; i++) {
    // Weave a Holy Spirit declaration every 5 days
    if (i % 5 === 2) {
      const hsTemplate = holySpiritMen[Math.floor(i / 5) % holySpiritMen.length];
      hombresDecls[i] = {
        ...hombresDecls[i],
        topic: 'holy_spirit',
        topics: ['holy_spirit', 'fe', 'fortaleza'],
        reference: hsTemplate.ref,
        verse: hsTemplate.verse,
        text: hsTemplate.decl,
      };
    }
  }

  for (let i = 0; i < mujeresDecls.length; i++) {
    if (i % 5 === 2) {
      const hsTemplate = holySpiritWomen[Math.floor(i / 5) % holySpiritWomen.length];
      mujeresDecls[i] = {
        ...mujeresDecls[i],
        topic: 'holy_spirit',
        topics: ['holy_spirit', 'fe', 'paz'],
        reference: hsTemplate.ref,
        verse: hsTemplate.verse,
        text: hsTemplate.decl,
      };
    }
  }

  // Save the enriched declarations-365.json
  rawDecls.hombres = hombresDecls;
  rawDecls.mujeres = mujeresDecls;
  fs.writeFileSync(declJsonPath, JSON.stringify(rawDecls, null, 2), 'utf8');
  console.log('Updated declarations-365.json with rich Holy Spirit content!');

  // Build SQL Statements
  console.log('Generating SQL statements...');
  let sqlDevotionals = [];
  for (const d of rawDevs) {
    const id = d.id || crypto.randomUUID();
    const day = d.dayNumber;
    const title = d.title;
    const dur = d.durationMinutes || 3;
    const vRef = d.verseReference;
    const vText = d.verseText;
    const refl = d.reflectionText;
    const pray = d.prayerText;

    sqlDevotionals.push(
      `(${escapeSql(id)}, ${day}, ${escapeSql(title)}, ${dur}, ${escapeSql(vText)}, ${escapeSql(vRef)}, ${escapeSql(refl)}, ${escapeSql(pray)})`
    );
  }

  let sqlDeclarations = [];
  const allDecls = [...hombresDecls, ...mujeresDecls];
  for (let idx = 0; idx < allDecls.length; idx++) {
    const d = allDecls[idx];
    const id = crypto.randomUUID();
    const day = d.dayNumber || ((idx % 365) + 1);
    const gender = d.gender || (idx < 365 ? 'hombres' : 'mujeres');
    const topic = d.topic || (d.topics && d.topics[0]) || 'fe';
    const vText = d.verse;
    const vRef = d.reference;
    const declText = d.text;

    sqlDeclarations.push(
      `(${escapeSql(id)}, ${day}, ${escapeSql(vText)}, ${escapeSql(vRef)}, ${escapeSql(declText)}, ${escapeSql(topic)}, ${escapeSql(gender)})`
    );
  }

  // Update schema.sql with the tables and seed data
  console.log('Reading schema.sql base...');
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaBase = fs.readFileSync(schemaPath, 'utf8');

  // Find where the Seed Data section starts:
  const seedMarker = '-- ============================================================================';
  const seedIdx = schemaBase.indexOf('-- Datos Iniciales de Ejemplo (Seed Data)');
  let tableStructure = schemaBase;
  if (seedIdx !== -1) {
    // Find the marker right before it
    const cutIdx = schemaBase.lastIndexOf(seedMarker, seedIdx);
    if (cutIdx !== -1) {
      tableStructure = schemaBase.substring(0, cutIdx).trim();
    }
  }

  // Ensure day_number is included in CREATE TABLE declarations
  if (!tableStructure.includes('day_number INT NULL')) {
    tableStructure = tableStructure.replace(
      'gender ENUM(\'mujeres\', \'hombres\', \'todos\') NOT NULL DEFAULT \'todos\',',
      'gender ENUM(\'mujeres\', \'hombres\', \'todos\') NOT NULL DEFAULT \'todos\',\n  day_number INT NULL,'
    );
  }

  // Ensure topics seed is preserved from original
  const topicsSeedSql = `
-- Temas iniciales (Topics & Series)
INSERT IGNORE INTO topics (id, sort_order, tag, title, subtitle, description, scripture_quote, scripture_reference, video_duration_minutes, youtube_query) VALUES
('top-1', 1, 'Ansiedad', 'When your mind will not settle', 'Three practices for the days your mind will not settle · 8 min video', 'La ansiedad rara vez se anuncia; llega como una mente llena, poca paciencia o una noche sin dormir. La Escritura no te pide fingir que no existe, te invita a entregarla.', '“Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.”', '1 Pedro 5:7', 8, 'Pregare ansiedad paz confianza'),
('top-2', 2, 'Propósito', 'Walking in Clarity and Faith', 'Discovering God\\'s direction for your daily walk', 'El propósito no es un destino lejano, es la fidelidad con la que caminas hoy.', '“Porque yo sé los pensamientos que tengo acerca de vosotros, dice el Señor...”', 'Jeremías 29:11', 6, 'Pregare proposito direccion dios');

INSERT IGNORE INTO topic_practices (id, topic_id, step_number, instruction_text) VALUES
('tp-1', 'top-1', 1, 'Nombra lo que sientes en voz alta antes de buscar una solución humana.'),
('tp-2', 'top-1', 2, 'Escribe una sola frase de lo que estás entregando a Dios hoy.'),
('tp-3', 'top-1', 3, 'Declara Filipenses 4:7 cada mañana durante siete días consecutivos.');
`;

  // Format devotionals chunks of 50
  let devotionalsChunks = [];
  for (let i = 0; i < sqlDevotionals.length; i += 50) {
    const chunk = sqlDevotionals.slice(i, i + 50);
    devotionalsChunks.push(
      `INSERT IGNORE INTO devotionals (id, day_number, title, duration_minutes, verse_text, verse_reference, reflection_text, prayer_text) VALUES\n` +
      chunk.join(',\n') + ';'
    );
  }

  // Format declarations chunks of 50
  let declarationsChunks = [];
  for (let i = 0; i < sqlDeclarations.length; i += 50) {
    const chunk = sqlDeclarations.slice(i, i + 50);
    declarationsChunks.push(
      `INSERT IGNORE INTO declarations (id, day_number, scripture_text, scripture_reference, declaration_text, topic, gender) VALUES\n` +
      chunk.join(',\n') + ';'
    );
  }

  const newSeedSection = `
-- ============================================================================
-- Datos Iniciales: 365 Devocionales y 730 Declaraciones (Hombres & Mujeres)
-- ============================================================================

-- ── 365 Devocionales Diarios ──────────────────────────────────────────────────
${devotionalsChunks.join('\n\n')}

-- ── 730 Declaraciones Diarias (con fuerte énfasis en el Espíritu Santo) ───────
${declarationsChunks.join('\n\n')}

${topicsSeedSql}
`;

  const finalSchemaSql = tableStructure + '\n\n' + newSeedSection.trim() + '\n';
  fs.writeFileSync(schemaPath, finalSchemaSql, 'utf8');
  console.log(`schema.sql updated successfully (${Math.round(finalSchemaSql.length / 1024)} KB)!`);

  // Now execute directly into the local MySQL database
  console.log('Connecting to MySQL local database to insert records...');
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USERNAME || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_DATABASE || 'pregare';

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
  });

  console.log('Connected to MySQL. Updating schema tables and inserting 365 devotionals and declarations...');
  
  // Make sure day_number column exists in declarations
  try {
    await connection.query('ALTER TABLE declarations ADD COLUMN day_number INT NULL AFTER gender;');
  } catch (err) {
    // column already exists, ignore
  }

  // Clear existing devotionals and declarations to cleanly replace with the full 365 sets
  await connection.query('DELETE FROM devotionals;');
  await connection.query('DELETE FROM declarations;');

  console.log('Inserting 365 Devotionals into database...');
  for (const chunkSql of devotionalsChunks) {
    await connection.query(chunkSql);
  }

  console.log('Inserting 730 Declaraciones into database...');
  for (const chunkSql of declarationsChunks) {
    await connection.query(chunkSql);
  }

  const [devCount] = await connection.query('SELECT count(*) as c FROM devotionals;');
  const [declCount] = await connection.query('SELECT count(*) as c FROM declarations;');
  const [hsCount] = await connection.query('SELECT count(*) as c FROM declarations WHERE topic = "holy_spirit" OR declaration_text LIKE "%Holy Spirit%";');

  console.log(`\n================ SUCCESS ================`);
  console.log(`Devotionals in MySQL: ${devCount[0].c}`);
  console.log(`Declarations in MySQL: ${declCount[0].c}`);
  console.log(`Holy Spirit Declarations in MySQL: ${hsCount[0].c}`);
  console.log(`=========================================\n`);

  await connection.end();
}

main().catch((err) => {
  console.error('Error populating 365 database items:', err);
  process.exit(1);
});
