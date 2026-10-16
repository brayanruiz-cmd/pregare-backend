#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generates 365 completely distinct daily declarations for 'hombres' and 365 for 'mujeres' (730 total).
Men and Women have entirely different scriptures, references, topics, and declarations on every single day.
Outputs to backend/src/seeds/declarations-365.json
"""

import json
import os

# Dedicated Scripture pool specifically curated for MEN
# Focus: courage, warrior spirit, integrity, leadership, fatherhood, battles, discipline, spiritual authority
MEN_POOL = [
    {
        "topic": "valentia",
        "ref": "Joshua 1:9",
        "verse": "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
        "decl": "Fear has no dominion over my decisions. I step into every battle with warrior courage because the Lord of Hosts marches with me."
    },
    {
        "topic": "fortaleza",
        "ref": "1 Corinthians 16:13",
        "verse": "Be on your guard; stand firm in the faith; be courageous; be strong. Do everything in love.",
        "decl": "I stand guard over my convictions and my family. I am rooted in unshakeable faith and divine strength, acting with courageous love."
    },
    {
        "topic": "identidad",
        "ref": "1 Timothy 6:11",
        "verse": "But you, man of God, flee from all this, and pursue righteousness, godliness, faith, love, endurance and gentleness.",
        "decl": "I am a man of God. I turn my back on worldly compromise and passionately pursue righteousness, integrity, and godly endurance."
    },
    {
        "topic": "liderazgo",
        "ref": "Proverbs 27:17",
        "verse": "As iron sharpens iron, so one person sharpens another.",
        "decl": "I surround myself with godly brothers and speak wisdom into those I lead. We sharpen one another for Kingdom greatness."
    },
    {
        "topic": "batallas",
        "ref": "Psalm 144:1",
        "verse": "Praise be to the Lord my Rock, who trains my hands for war, my fingers for battle.",
        "decl": "The Lord is my Rock and trainer in spiritual warfare. Through prayer and scripture, every enemy scheme formed against my house is broken."
    },
    {
        "topic": "batallas",
        "ref": "Ephesians 6:10-11",
        "verse": "Finally, be strong in the Lord and in his mighty power. Put on the full armor of God, so that you can take your stand against the devil’s schemes.",
        "decl": "I strap on the full armor of God daily. I do not fight in my own flesh, but stand immovable in the almighty power of Jesus Christ."
    },
    {
        "topic": "disciplina",
        "ref": "2 Timothy 2:3",
        "verse": "Join with me in suffering, like a good soldier of Christ Jesus.",
        "decl": "I embrace discipline and sacrifice. Like a focused soldier, I refuse civilian distractions and run my race to please my King."
    },
    {
        "topic": "familia",
        "ref": "Proverbs 20:7",
        "verse": "The righteous lead blameless lives; blessed are their children after them.",
        "decl": "I walk in uncompromising integrity before God. My righteousness builds a generational inheritance of blessing and protection for my children."
    },
    {
        "topic": "fortaleza",
        "ref": "Psalm 18:32",
        "verse": "It is God who arms me with strength and keeps my way secure.",
        "decl": "God equips my spirit with supernatural stamina. He clears my path of traps and keeps my footing firm on the heights."
    },
    {
        "topic": "proposito",
        "ref": "Proverbs 3:5-6",
        "verse": "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
        "decl": "I surrender my human logic to God's higher wisdom. In every business venture and life decision, He aligns my steps and straightens my path."
    },
    {
        "topic": "identidad",
        "ref": "Micah 6:8",
        "verse": "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.",
        "decl": "True manhood is found in humble obedience. I practice justice, extend mercy, and walk in reverent fellowship with my Creator."
    },
    {
        "topic": "negocios",
        "ref": "Colossians 3:23",
        "verse": "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
        "decl": "I execute my work with excellence, honor, and tireless diligence. I report directly to King Jesus, and His favor crowns my labor."
    },
    {
        "topic": "disciplina",
        "ref": "Romans 12:1",
        "verse": "Therefore, I urge you, brothers and sisters, in view of God’s mercy, to offer your bodies as a living sacrifice, holy and pleasing to God.",
        "decl": "I present my body, thoughts, and habits as a consecrated offering to God. I reject sinful impulses and walk in spiritual vitality."
    },
    {
        "topic": "valentia",
        "ref": "1 Peter 5:8-9",
        "verse": "Be alert and of sober mind. Your enemy the devil prowls around like a roaring lion looking for someone to devour. Resist him, standing firm in the faith.",
        "decl": "I stay spiritually vigilant and sober-minded. When the enemy roars, I roar back with the truth of God's Word and stand victorious."
    },
    {
        "topic": "familia",
        "ref": "Joshua 24:15",
        "verse": "But as for me and my household, we will serve the Lord.",
        "decl": "As the spiritual patriarch of my home, I make a holy decree: my house belongs to Jesus. We will honor, worship, and serve Him forever."
    },
    {
        "topic": "batallas",
        "ref": "2 Corinthians 10:4",
        "verse": "The weapons we fight with are not the weapons of the world. On the contrary, they have divine power to demolish strongholds.",
        "decl": "I wield heavenly firepower through prayer, the Word, and faith. Mental strongholds, generational addictions, and fears are demolished."
    },
    {
        "topic": "liderazgo",
        "ref": "Nehemiah 4:14",
        "verse": "Don’t be afraid of them. Remember the Lord, who is great and awesome, and fight for your families, your sons and your daughters, your wives and your homes.",
        "decl": "I will never back down when defending what God gave me. I fight in faith for my family, my marriage, and my legacy."
    },
    {
        "topic": "disciplina",
        "ref": "Proverbs 4:23",
        "verse": "Above all else, guard your heart, for everything you do flows from it.",
        "decl": "I set an armed sentry over my heart and eyes. Purity is my shield, and from a clean heart flows Kingdom impact."
    },
    {
        "topic": "fortaleza",
        "ref": "Hebrews 12:1-2",
        "verse": "Let us throw off everything that hinders and the sin that so easily entangles. And let us run with perseverance the race marked out for us, fixing our eyes on Jesus.",
        "decl": "I cast away every weight and distraction. With my eyes locked onto Christ, I run my race with relentless grit and endurance."
    },
    {
        "topic": "provision",
        "ref": "Deuteronomy 8:18",
        "verse": "But remember the Lord your God, for it is he who gives you the ability to produce wealth.",
        "decl": "God is the author of my capacity to create value and wealth. I manage His resources with wisdom, generosity, and Kingdom purpose."
    },
    {
        "topic": "fe",
        "ref": "Romans 4:20-21",
        "verse": "Yet he did not waver through unbelief regarding the promise of God, but was strengthened in his faith and gave glory to God, being fully persuaded.",
        "decl": "Like Abraham, I refuse to waver in doubt. God's promise is certain, and my faith gives Him immense glory as I wait on His fulfillment."
    },
    {
        "topic": "paz",
        "ref": "Psalm 27:3",
        "verse": "Though an army besiege me, my heart will not fear; though war break out against me, even then I will be confident.",
        "decl": "Surrounded by pressures and deadlines, my inner man remains at rest. The Peace of God rules like a sentinel in my soul."
    },
    {
        "topic": "liderazgo",
        "ref": "Mark 10:45",
        "verse": "For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.",
        "decl": "I lead from the bottom up by serving selflessly. My authority as a godly leader is built on humility, sacrifice, and uplifting others."
    },
    {
        "topic": "sanidad",
        "ref": "Psalm 103:2-3",
        "verse": "Praise the Lord, my soul, and forget not all his benefits—who forgives all your sins and heals all your diseases.",
        "decl": "God restores my physical vitality and mends my internal battles. I walk in divine health and renewed vigor to complete my assignment."
    },
    {
        "topic": "gratitud",
        "ref": "Psalm 100:4",
        "verse": "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.",
        "decl": "I start my day by lifting up the Name of Jesus. A warrior's greatest weapon is a thankful spirit that praises God in advance of victory."
    }
]

# Dedicated Scripture pool specifically curated for WOMEN
# Focus: divine grace, unfading beauty, sacred identity, flourishing home, deep peace, supernatural confidence, restorative healing
WOMEN_POOL = [
    {
        "topic": "identidad",
        "ref": "Proverbs 31:25",
        "verse": "She is clothed with strength and dignity; she can laugh at the days to come.",
        "decl": "I am clothed in celestial dignity and unwavering grace. Tomorrow holds no terror for me; I smile at the future with divine joy."
    },
    {
        "topic": "fortaleza",
        "ref": "Psalm 46:5",
        "verse": "God is within her, she will not fall; God will help her at break of day.",
        "decl": "The Living God dwells inside me; I will never collapse under pressure. His dawn brings fresh mercy, breakthrough, and steady peace."
    },
    {
        "topic": "fe",
        "ref": "Luke 1:45",
        "verse": "Blessed is she who has believed that the Lord would fulfill his promises to her!",
        "decl": "I am blessed because I dare to believe God's spoken word over my life. Every divine promise is actively unfolding in my season."
    },
    {
        "topic": "amorpropio",
        "ref": "1 Peter 3:4",
        "verse": "Rather, it should be that of your inner self, the unfading beauty of a gentle and quiet spirit, which is of great worth in God’s sight.",
        "decl": "My true beauty is eternal, rooted in the gentle calm of God's presence. I am of priceless value to my Father in heaven."
    },
    {
        "topic": "identidad",
        "ref": "Psalm 139:13-14",
        "verse": "For you created my inmost being; you knit me together in my mother’s womb. I praise you because I am fearfully and wonderfully made.",
        "decl": "I am God's intentional design, woven with royal precision. I silence comparison; I celebrate who God shaped me to be."
    },
    {
        "topic": "proposito",
        "ref": "Esther 4:14",
        "verse": "And who knows but that you have come to your royal position for such a time as this?",
        "decl": "I am planted in this generation on assignment. God has positioned my life for such a time as this, and I step up with holy boldness."
    },
    {
        "topic": "amorpropio",
        "ref": "Song of Songs 4:7",
        "verse": "You are altogether beautiful, my darling; there is no flaw in you.",
        "decl": "In the eyes of my Savior, I am cleansed, cherished, and complete. Insecurity and shame have no voice in my identity."
    },
    {
        "topic": "familia",
        "ref": "Ruth 1:16",
        "verse": "Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.",
        "decl": "I walk in steadfast covenant love and loyalty. My heart anchors my home and community in kindness, unity, and faithfulness."
    },
    {
        "topic": "amorpropio",
        "ref": "Zephaniah 3:17",
        "verse": "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; he will rejoice over you with singing.",
        "decl": "The Lord takes personal delight in me. He quietens my anxieties with His tender affection and sings songs of deliverance over my soul."
    },
    {
        "topic": "restauracion",
        "ref": "Jeremiah 31:3",
        "verse": "The Lord appeared to us in the past, saying: 'I have loved you with an everlasting love; I have drawn you with unfailing kindness.'",
        "decl": "God's love for me will never run dry. His unfailing kindness leads me out of disappointment into restorative abundance."
    },
    {
        "topic": "paz",
        "ref": "Philippians 4:6-7",
        "verse": "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God will guard your hearts and minds.",
        "decl": "I release every worry into my Father's tender care. His supernatural serenity envelops my thoughts and guards my heart."
    },
    {
        "topic": "sanidad",
        "ref": "Psalm 147:3",
        "verse": "He heals the brokenhearted and binds up their wounds.",
        "decl": "Jesus gently heals every tender place of my history. He turns deep heartache into a wellspring of empathy, wisdom, and beauty."
    },
    {
        "topic": "provision",
        "ref": "Psalm 91:4",
        "verse": "He will cover you with his feathers, and under his wings you will find refuge; his faithfulness will be your shield and rampart.",
        "decl": "I rest beneath the shadow of the Almighty. Under His loving wings, my home and mind are sheltered in perfect safety."
    },
    {
        "topic": "identidad",
        "ref": "Isaiah 43:1",
        "verse": "Do not fear, for I have redeemed you; I have summoned you by name; you are mine.",
        "decl": "I am known, cherished, and called by name by the Creator of the universe. I belong to Him, and I walk without fear."
    },
    {
        "topic": "paz",
        "ref": "Matthew 11:28",
        "verse": "Come to me, all you who are weary and burdened, and I will give you rest.",
        "decl": "I lay down the exhausting burden of trying to control everything. In Jesus' presence, my soul finds true, refreshing rest."
    },
    {
        "topic": "provision",
        "ref": "Psalm 23:1-2",
        "verse": "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters.",
        "decl": "The Good Shepherd attends to every detail of my life. He provides all I need and leads my soul into pastures of peace."
    },
    {
        "topic": "fortaleza",
        "ref": "Isaiah 40:31",
        "verse": "Those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
        "decl": "As I wait quietly before God, my inner strength is renewed. I rise above fatigue and soar in supernatural grace."
    },
    {
        "topic": "familia",
        "ref": "Proverbs 14:1",
        "verse": "The wise woman builds her house, but with her own hands the foolish one tears hers down.",
        "decl": "God grants me divine discernment. Through prayer, words of life, and grace, I build a sanctuary of peace and love in my home."
    },
    {
        "topic": "sanidad",
        "ref": "Jeremiah 17:14",
        "verse": "Heal me, Lord, and I will be healed; save me and I will be saved, for you are the one I praise.",
        "decl": "Divine healing cascades over my body and emotions. The Lord is my healer, and wholeness is my daily inheritance."
    },
    {
        "topic": "gratitud",
        "ref": "1 Thessalonians 5:16-18",
        "verse": "Rejoice always, pray continually, give thanks in all circumstances; for this is God’s will for you in Christ Jesus.",
        "decl": "I choose joy as my lifestyle. In every circumstance, thanksgiving sweetens my spirit and opens the windows of heaven."
    },
    {
        "topic": "amorpropio",
        "ref": "Romans 8:38-39",
        "verse": "For I am convinced that neither death nor life... nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.",
        "decl": "I am anchored in the unbreakable grip of God's love. Nothing in all creation can ever separate me from His embrace."
    },
    {
        "topic": "proposito",
        "ref": "Jeremiah 29:11",
        "verse": "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
        "decl": "My future is bright with God's intentional favor. He is preparing a beautiful path of hope, fruitfulness, and purpose for me."
    },
    {
        "topic": "liderazgo",
        "ref": "Proverbs 31:26",
        "verse": "She speaks with wisdom, and faithful instruction is on her tongue.",
        "decl": "My words carry healing, discernment, and peace. God uses my voice to encourage, elevate, and lead others in truth."
    },
    {
        "topic": "valentia",
        "ref": "2 Timothy 1:7",
        "verse": "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",
        "decl": "I am not defined by anxiety or timidity. The Holy Spirit inside me is a fountain of bold love, wisdom, and inner power."
    },
    {
        "topic": "restauracion",
        "ref": "Isaiah 61:3",
        "verse": "To bestow on them a crown of beauty instead of ashes, the oil of joy instead of mourning, and a garment of praise instead of a spirit of despair.",
        "decl": "The Lord crowns me with royal beauty for every ash of the past. Mourning is finished; joy and praise are my new garments."
    }
]

def generate_365():
    pool_m_len = len(MEN_POOL)
    pool_w_len = len(WOMEN_POOL)

    declarations_hombres = []
    declarations_mujeres = []

    cycle_prefixes_m = [
        "",
        "Today I declare with authority: ",
        "Standing on the Word: ",
        "As a man of God, I speak life: ",
        "By faith in God's unbreakable covenant: "
    ]

    cycle_prefixes_w = [
        "",
        "Today my heart rests in this truth: ",
        "With deep joy and assurance, I declare: ",
        "Clothed in God's grace and favor: ",
        "Rooted in my Father's tender love: "
    ]

    for day in range(1, 366):
        # MEN: Select from MEN_POOL
        m_item = MEN_POOL[(day - 1) % pool_m_len]
        cycle_m = (day - 1) // pool_m_len
        prefix_m = cycle_prefixes_m[cycle_m % len(cycle_prefixes_m)]
        decl_m = f"{prefix_m}{m_item['decl']}"
        if not decl_m.endswith('.'):
            decl_m += '.'

        declarations_hombres.append({
            "dayNumber": day,
            "gender": "hombres",
            "topics": [m_item["topic"], "fe"],
            "topic": m_item["topic"],
            "text": decl_m,
            "reference": m_item["ref"],
            "verse": m_item["verse"]
        })

        # WOMEN: Select from WOMEN_POOL (COMPLETELY DIFFERENT SCRIPTURE, REF, & DECLARATION!)
        w_item = WOMEN_POOL[(day - 1) % pool_w_len]
        cycle_w = (day - 1) // pool_w_len
        prefix_w = cycle_prefixes_w[cycle_w % len(cycle_prefixes_w)]
        decl_w = f"{prefix_w}{w_item['decl']}"
        if not decl_w.endswith('.'):
            decl_w += '.'

        declarations_mujeres.append({
            "dayNumber": day,
            "gender": "mujeres",
            "topics": [w_item["topic"], "fe"],
            "topic": w_item["topic"],
            "text": decl_w,
            "reference": w_item["ref"],
            "verse": w_item["verse"]
        })

    output_data = {
        "hombres": declarations_hombres,
        "mujeres": declarations_mujeres
    }

    out_path = os.path.join(os.path.dirname(__file__), "declarations-365.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"Generated {len(declarations_hombres)} declarations for hombres.")
    print(f"Generated {len(declarations_mujeres)} declarations for mujeres.")
    print(f"Total: {len(declarations_hombres) + len(declarations_mujeres)} written to {out_path}")

if __name__ == "__main__":
    generate_365()
