#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generates 365 comprehensive, high-theology, emotionally resonant Christian daily devotionals in English.
Follows a 12-season annual curriculum.
Outputs JSON for insertion into MySQL 'devotionals' table.
"""

import json
import uuid

# 12 Seasons definitions with rich thematic pools of scriptures, titles, themes, practices, and prayers.
SEASONS = [
    {
        "month": 1,
        "name": "Awakening & Identity in Christ",
        "days": 31,
        "start_day": 1,
        "theme_desc": "Understanding your unshakeable identity as a child of God, new beginnings, and renewing your mind.",
        "anchors": [
            ("2 Corinthians 5:17", "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!", "A Clean Slate: Rooted in Grace"),
            ("Romans 8:1", "There is therefore now no condemnation for those who are in Christ Jesus.", "Free from the Weight of Condemnation"),
            ("Ephesians 1:4-5", "For he chose us in him before the creation of the world to be holy and blameless in his sight. In love he predestined us for adoption to sonship through Jesus Christ.", "Adopted and Cherished by the Father"),
            ("Galatians 2:20", "I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me.", "The Indwelling Life of Christ"),
            ("1 John 3:1", "See what great love the Father has lavished on us, that we should be called children of God! And that is what we are!", "Lavished in Divine Love"),
            ("Colossians 3:3", "For you died, and your life is now hidden with Christ in God.", "Secure in the Hidden Place"),
            ("Psalm 139:14", "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.", "Woven with Divine Intention"),
            ("Ephesians 2:10", "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.", "The Master's Living Artwork"),
            ("Romans 8:37", "No, in all these things we are more than conquerors through him who loved us.", "More Than a Conqueror"),
            ("1 Peter 2:9", "But you are a chosen people, a royal priesthood, a holy nation, God's special possession, that you may declare the praises of him who called you out of darkness into his wonderful light.", "Chosen for Holy Purpose"),
            ("John 15:15", "I no longer call you servants, because a servant does not know his master's business. Instead, I have called you friends.", "Called a Friend of God"),
            ("Zephaniah 3:17", "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.", "Rejoiced Over with Singing"),
            ("Philippians 1:6", "Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.", "He Who Began the Work"),
            ("Romans 12:2", "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.", "The Renewed Mind"),
            ("Isaiah 43:1", "Do not fear, for I have redeemed you; I have summoned you by name; you are mine.", "Summoned by Name"),
            ("2 Timothy 1:7", "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.", "A Spirit of Power and Sound Mind"),
            ("Ephesians 1:7", "In him we have redemption through his blood, the forgiveness of sins, in accordance with the riches of God's grace.", "Redeemed by Riches of Grace"),
            ("John 1:12", "Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God.", "The Right to Belong"),
            ("2 Corinthians 3:18", "And we all, who with unveiled faces contemplate the Lord’s glory, are being transformed into his image with ever-increasing glory.", "Ever-Increasing Glory"),
            ("Psalm 103:12", "As far as the east is from the west, so far has he removed our transgressions from us.", "The Distance of Forgiveness"),
            ("Titus 3:5", "He saved us, not because of righteous things we had done, but because of his mercy. He saved us through the washing of rebirth and renewal by the Holy Spirit.", "Bathed in Merciful Renewal"),
            ("Colossians 1:13", "For he has rescued us from the dominion of darkness and brought us into the kingdom of the Son he loves.", "Transferred to the Light"),
            ("Romans 8:15", "The Spirit you received does not make you slaves, so that you live in fear again; rather, the Spirit you received brought about your adoption to sonship. And by him we cry, 'Abba, Father.'", "Cry Out: Abba Father"),
            ("Hebrews 4:16", "Let us then approach God’s throne of grace with confidence, so that we may receive mercy and find grace to help us in our time of need.", "Approaching the Throne with Boldness"),
            ("Psalm 27:1", "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?", "The Stronghold of My Life"),
            ("1 Corinthians 6:19-20", "Do you not know that your bodies are temples of the Holy Spirit, who is in you, whom you have received from God? You are not your own; you were bought at a price.", "Temple of the Holy Spirit"),
            ("Isaiah 49:16", "See, I have engraved you on the palms of my hands; your walls are ever before me.", "Engraved on the Palms of His Hands"),
            ("Ephesians 2:6", "And God raised us up with Christ and seated us with him in the heavenly realms in Christ Jesus.", "Seated in Heavenly Places"),
            ("Romans 6:6", "For we know that our old self was crucified with him so that the body ruled by sin might be done away with, that we should no longer be slaves to sin.", "The Broken Yoke of Sin"),
            ("Colossians 2:10", "And in Christ you have been brought to fullness. He is the head over every power and authority.", "Complete in Christ"),
            ("Psalm 16:11", "You make known to me the path of life; you will fill me with joy in your presence, with eternal pleasures at your right hand.", "The Fullness of Life in His Presence")
        ]
    },
    {
        "month": 2,
        "name": "The Peace That Transcends",
        "days": 28,
        "start_day": 32,
        "theme_desc": "Surrendering anxiety, releasing control, and anchoring your soul in the calm waters of God's sovereignty.",
        "anchors": [
            ("Philippians 4:6-7", "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.", "The Peace Beyond Understanding"),
            ("Psalm 23:1-2", "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters.", "Beside the Quiet Waters"),
            ("Matthew 6:26", "Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?", "The Care of the Father"),
            ("Isaiah 26:3", "You will keep in perfect peace those whose minds are steadfast, because they trust in you.", "Steadfast Peace in a Fractured World"),
            ("John 14:27", "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.", "The Gift the World Cannot Give"),
            ("Psalm 46:10", "Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.", "The Power of Absolute Stillness"),
            ("Colossians 3:15", "Let the peace of Christ rule in your hearts, since as members of one body you were called to peace. And be thankful.", "Let Peace Act as Arbiter"),
            ("Matthew 11:28", "Come to me, all you who are weary and burdened, and I will give you rest.", "Rest for the Exhausted Soul"),
            ("Psalm 4:8", "In peace I will lie down and sleep, for you alone, Lord, make me dwell in safety.", "Sleep in Heavenly Safety"),
            ("1 Peter 5:7", "Cast all your anxiety on him because he cares for you.", "The Holy Exchange of Burdens"),
            ("Exodus 14:14", "The Lord will fight for you; you need only to be still.", "When God Fights in the Silence"),
            ("Psalm 94:19", "When anxiety was great within me, your consolation brought me joy.", "Divine Consolation in the Night"),
            ("Proverbs 12:25", "Anxiety weighs down the heart, but a kind word cheers it up.", "Unburdening the Heavy Heart"),
            ("Isaiah 30:15", "In repentance and rest is your salvation, in quietness and trust is your strength.", "Strength Found in Quiet Trust"),
            ("Psalm 62:1", "Truly my soul finds rest in God; my salvation comes from him.", "Silent Rest in the Almighty"),
            ("John 16:33", "I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.", "Overcoming the Chaos of the World"),
            ("Psalm 55:22", "Cast your cares on the Lord and he will sustain you; he will never let the righteous be shaken.", "He Will Never Let You Fall"),
            ("2 Thessalonians 3:16", "Now may the Lord of peace himself give you peace at all times and in every way. The Lord be with all of you.", "Peace at All Times and in Every Way"),
            ("Luke 8:24", "He got up and rebuked the wind and the raging waters; the storm subsided, and all was calm.", "The Voice That Calms the Raging Sea"),
            ("Psalm 121:1-2", "I lift up my eyes to the mountains—where does my help come from? My help comes from the Lord, the Maker of heaven and earth.", "Help from the Creator of the Heavens"),
            ("Romans 15:13", "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.", "Overflowing with Serenity and Joy"),
            ("Psalm 3:5", "I lie down and sleep; I wake again, because the Lord sustains me.", "Waking to Sustaining Grace"),
            ("Isaiah 32:17", "The fruit of that righteousness will be peace; its effect will be quietness and confidence forever.", "The Lasting Fruit of Righteousness"),
            ("Psalm 131:2", "Truly I have stilled and quieted my soul; like a weaned child with its mother, like a weaned child is my soul within me.", "A Calmed and Quieted Soul"),
            ("Matthew 6:34", "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.", "Confining Worry to Today"),
            ("Psalm 119:165", "Great peace have those who love your law, and nothing can make them stumble.", "Unstumbling Peace in the Word"),
            ("Psalm 91:4", "He will cover you with his feathers, and under his wings you will find refuge; his faithfulness will be your shield and rampart.", "Sheltered Beneath the Wings of Peace"),
            ("Numbers 6:26", "The Lord turn his face toward you and give you peace.", "The Benediction of Divine Countenance")
        ]
    },
    {
        "month": 3,
        "name": "Unshakable Faith & Radical Trust",
        "days": 31,
        "start_day": 60,
        "theme_desc": "Stepping out onto the water, holding onto divine promises when circumstances contradict, and living by faith.",
        "anchors": [
            ("Hebrews 11:1", "Now faith is confidence in what we hope for and assurance about what we do not see.", "The Evidence of the Unseen"),
            ("Proverbs 3:5-6", "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", "Leaning Out of Human Reason"),
            ("Mark 11:22-24", "Have faith in God, Jesus answered. Truly I tell you, if anyone says to this mountain, 'Go, throw yourself into the sea,' and does not doubt in their heart but believes that what they say will happen, it will be done for them.", "Faith That Uproots Mountains"),
            ("2 Corinthians 5:7", "For we live by faith, not by sight.", "Walking Through the Fog by Faith"),
            ("Matthew 17:20", "Truly I tell you, if you have faith as small as a mustard seed, you can say to this mountain, 'Move from here to there,' and it will move. Nothing will be impossible for you.", "The Mustard Seed Principle"),
            ("Romans 4:20-21", "Yet he did not waver through unbelief regarding the promise of God, but was strengthened in his faith and gave glory to God, being fully persuaded that God had power to do what he had promised.", "Unwavering in the Promised Word"),
            ("Hebrews 11:6", "And without faith it is impossible to please God, because anyone who comes to him must believe that he exists and that he rewards those who earnestly seek him.", "The Faith That Pleases Heaven"),
            ("James 1:6", "But when you ask, you must believe and not doubt, because the one who doubts is like a wave of the sea, blown and tossed by the wind.", "Anchored Against the Waves of Doubt"),
            ("Psalm 37:5", "Commit your way to the Lord; trust in him and he will do this.", "Full Surrender of the Path Ahead"),
            ("Luke 1:37", "For no word from God will ever fail.", "The Infallible Word"),
            ("Romans 10:17", "Consequently, faith comes from hearing the message, and the message is heard through the word about Christ.", "Feeding the Embers of Faith"),
            ("Psalm 20:7", "Some trust in chariots and some in horses, but we trust in the name of the Lord our God.", "Beyond Horses and Chariots"),
            ("Mark 9:24", "Immediately the boy’s father exclaimed, 'I do believe; help me overcome my unbelief!'", "The Honest Cry of the Doubting Heart"),
            ("Hebrews 12:2", "Fixing our eyes on Jesus, the pioneer and perfecter of faith.", "Eyes Locked on the Pioneer"),
            ("Psalm 56:3", "When I am afraid, I put my trust in you.", "Faith When Fear Knocks"),
            ("Jeremiah 17:7", "But blessed is the one who trusts in the Lord, whose confidence is in him.", "The Tree Planted by Living Water"),
            ("Matthew 14:29-31", "Then Peter got down out of the boat, walked on the water and came toward Jesus. But when he saw the wind, he was afraid... Jesus reached out his hand and caught him.", "Stepping Outside the Boat"),
            ("1 Peter 1:7", "These have come so that the proven genuineness of your faith—of greater worth than gold, which perishes even though refined by fire—may result in praise, glory and honor.", "Gold Refined in the Crucible"),
            ("Psalm 9:10", "Those who know your name trust in you, for you, Lord, have never forsaken those who seek you.", "Trust Born of Intimacy"),
            ("Habakkuk 3:17-18", "Though the fig tree does not bud and there are no grapes on the vines... yet I will rejoice in the Lord, I will be joyful in God my Savior.", "Rejoicing When the Fields are Bare"),
            ("Luke 17:5", "The apostles said to the Lord, 'Increase our faith!'", "The Prayer for Deepened Faith"),
            ("1 Timothy 6:12", "Fight the good fight of the faith. Take hold of the eternal life to which you were called.", "Engaging the Fight of Faith"),
            ("Psalm 118:8", "It is better to take refuge in the Lord than to trust in humans.", "The Unshakable Foundation"),
            ("2 Corinthians 4:18", "So we fix our eyes not on what is seen, but on what is unseen, since what is seen is temporary, but what is unseen is eternal.", "Gazing into Eternity"),
            ("Galatians 3:11", "Clearly no one who relies on the law is justified before God, because 'the righteous will live by faith.'", "The Righteous Life of Radical Faith"),
            ("Psalm 31:14", "But I trust in you, Lord; I say, 'You are my God.'", "Declaring: You Are My God"),
            ("Romans 1:17", "For in the gospel the righteousness of God is revealed—a righteousness that is by faith from first to last.", "From Faith to Faith"),
            ("Hebrews 10:38", "And, 'But my righteous one will live by faith. And I take no pleasure in the one who shrinks back.'", "Refusing to Shrink Back"),
            ("John 20:29", "Then Jesus told him, 'Because you have seen me, you have believed; blessed are those who have not seen and yet have believed.'", "The Blessing of Unseen Belief"),
            ("Psalm 125:1", "Those who trust in the Lord are like Mount Zion, which cannot be shaken but endures forever.", "Immovable as Mount Zion"),
            ("Ephesians 6:16", "In addition to all this, take up the shield of faith, with which you can extinguish all the flaming arrows of the evil one.", "The Shield That Quenches Fire")
        ]
    },
    {
        "month": 4,
        "name": "Supernatural Strength & Courage",
        "days": 30,
        "start_day": 91,
        "theme_desc": "Fortitude in the wilderness, rising above weariness, standing fearless before giants, and drawing power from the Holy Spirit.",
        "anchors": [
            ("Isaiah 40:29", "He gives strength to the weary and increases the power of the weak.", "Power Infused into the Exhausted"),
            ("Joshua 1:9", "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", "Commissioned with Courage"),
            ("Isaiah 40:31", "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.", "Soaring on Eagle Wings"),
            ("Psalm 27:14", "Wait for the Lord; be strong and take heart and wait for the Lord.", "Courage in the Holy Waiting"),
            ("2 Corinthians 12:9", "My grace is sufficient for you, for my power is made perfect in weakness. Therefore I will boast all the more gladly about my weaknesses, so that Christ’s power may rest on me.", "Power Perfected in Brokenness"),
            ("Ephesians 6:10", "Finally, be strong in the Lord and in his mighty power.", "Clothed in Sovereign Might"),
            ("Psalm 18:32", "It is God who arms me with strength and keeps my way secure.", "Armed with Heaven's Armor"),
            ("Nehemiah 8:10", "Do not grieve, for the joy of the Lord is your strength.", "Joy That Acts as Fortitude"),
            ("Psalm 46:1", "God is our refuge and strength, an ever-present help in trouble.", "The Ever-Present Rock"),
            ("Deuteronomy 31:6", "Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you; he will never leave you nor forsake you.", "Unforsaken in the Battle"),
            ("Psalm 73:26", "My flesh and my heart may fail, but God is the strength of my heart and my portion forever.", "When Body and Heart Falter"),
            ("1 Chronicles 16:11", "Look to the Lord and his strength; seek his face always.", "Seeking the Face of Might"),
            ("Psalm 28:7", "The Lord is my strength and my shield; my heart trusts in him, and he helps me.", "Shielded Heart, Victorious Voice"),
            ("Isaiah 12:2", "Surely God is my salvation; I will trust and not be afraid. The Lord, the Lord himself, is my strength and my defense; he has become my salvation.", "Song of Sovereign Rescue"),
            ("2 Timothy 4:17", "But the Lord stood at my side and gave me strength, so that through me the message might be fully proclaimed.", "When You Stand Alone, He Stands Beside"),
            ("Habakkuk 3:19", "The Sovereign Lord is my strength; he makes my feet like the feet of a deer, he enables me to tread on the heights.", "Deer's Feet on Mountain Heights"),
            ("Psalm 138:3", "When I called, you answered me; you greatly emboldened me with strength in my soul.", "Soul-Strength Unleashed"),
            ("Psalm 84:5", "Blessed are those whose strength is in you, whose hearts are set on pilgrimage.", "The Blessed Pilgrim of Strength"),
            ("Exodus 15:2", "The Lord is my strength and my defense; he has become my salvation. He is my God, and I will praise him.", "Anthem of the Red Sea"),
            ("1 Samuel 30:6", "David was greatly distressed because the men were talking of stoning him... But David found strength in the Lord his God.", "Encouraging Yourself in God"),
            ("Psalm 119:28", "My soul is weary with sorrow; strengthen me according to your word.", "Strength Infused through Scripture"),
            ("Philippians 4:13", "I can do all this through him who gives me strength.", "Infused with Victorious Energy"),
            ("Romans 8:31", "What, then, shall we say in response to these things? If God is for us, who can be against us?", "If God Be For Us"),
            ("Psalm 29:11", "The Lord gives strength to his people; the Lord blesses his people with peace.", "The Gift of Strength and Peace"),
            ("Isaiah 41:10", "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.", "Upheld by His Right Hand"),
            ("Psalm 144:1", "Praise be to the Lord my Rock, who trains my hands for war, my fingers for battle.", "Trained for the High Calling"),
            ("Colossians 1:11", "Being strengthened with all power according to his glorious might so that you may have great endurance and patience.", "Endurance Through Glorious Might"),
            ("Zechariah 4:6", "Not by might nor by power, but by my Spirit,' says the Lord Almighty.", "The Holy Spirit's Gentle Power"),
            ("Psalm 59:16", "But I will sing of your strength, in the morning I will sing of your love; for you are my fortress, my refuge in times of trouble.", "Singing of His Fortitude at Dawn"),
            ("Deuteronomy 33:25", "Your strength will equal your days.", "Grace Tailored for Today's Weight")
        ]
    },
    {
        "month": 5,
        "name": "Divine Purpose & Calling",
        "days": 31,
        "start_day": 121,
        "theme_desc": "Discovering your destiny, unlocking your spiritual gifts, living intentionally, and impacting the Kingdom of God.",
        "anchors": [
            ("Jeremiah 29:11", "For I know the plans I have for you,' declares the Lord, 'plans to prosper you and not to harm you, plans to give you hope and a future.", "Architect of Hope and a Future"),
            ("Romans 8:28", "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", "Woven into Divine Harmony"),
            ("Esther 4:14", "And who knows but that you have come to your royal position for such a time as this?", "For Such a Time as This"),
            ("Psalm 138:8", "The Lord will fulfill his purpose for me; your love, Lord, endures forever—do not abandon the works of your hands.", "The Purpose He Will Complete"),
            ("1 Corinthians 12:4-7", "There are different kinds of gifts, but the same Spirit distributes them... Now to each one the manifestation of the Spirit is given for the common good.", "Unlocking Your Spiritual Gift"),
            ("Proverbs 19:21", "Many are the plans in a person’s heart, but it is the Lord’s purpose that prevails.", "When Heaven's Plan Prevails"),
            ("Romans 12:6", "We have different gifts, according to the grace given to each of us.", "Grace-Crafted Gifts"),
            ("1 Peter 4:10", "Each of you should use whatever gift you have received to serve others, as faithful stewards of God’s grace in its various forms.", "Stewards of Multicolored Grace"),
            ("Matthew 5:14-16", "You are the light of the world. A town built on a hill cannot be hidden... let your light shine before others, that they may see your good deeds and glorify your Father in heaven.", "The City on the Hill"),
            ("Colossians 4:17", "See to it that you complete the ministry you have received in the Lord.", "Completing What Heaven Began"),
            ("John 15:16", "You did not choose me, but I chose you and appointed you so that you might go and bear fruit—fruit that will last.", "Appointed for Lasting Fruit"),
            ("Galatians 1:15", "God, who set me apart from my mother’s womb and called me by his grace...", "Set Apart from the Womb"),
            ("Acts 20:24", "However, I consider my life worth nothing to me; my only aim is to finish the race and complete the task the Lord Jesus has given me.", "Finishing the Course with Joy"),
            ("Ephesians 4:1", "I urge you to live a life worthy of the calling you have received.", "Walking Worthy of the High Calling"),
            ("Micah 6:8", "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.", "The Simplicity of the Requirement"),
            ("2 Timothy 1:9", "He has saved us and called us to a holy life—not because of anything we have done but because of his own purpose and grace.", "Called to a Holy Life"),
            ("Philippians 2:13", "For it is God who works in you to will and to act in order to fulfill his good purpose.", "God Working the Will and Deed"),
            ("Psalm 57:2", "I cry out to God Most High, to God, who vindicates me and fulfills his purpose for me.", "The God Who Fulfills"),
            ("Proverbs 16:9", "In their hearts humans plan their course, but the Lord establishes their steps.", "Steps Guided by the Creator"),
            ("Matthew 28:19", "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.", "The Great Commission Commissioned"),
            ("1 Corinthians 10:31", "So whether you eat or drink or whatever you do, do it all for the glory of God.", "Holy Mundane: All for His Glory"),
            ("Isaiah 6:8", "Then I heard the voice of the Lord saying, 'Whom shall I send? And who will go for us?' And I said, 'Here am I. Send me!'", "Here Am I, Send Me"),
            ("1 Thessalonians 5:24", "The one who calls you is faithful, and he will do it.", "He Who Calls is Faithful"),
            ("Ephesians 3:20", "Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us.", "Beyond What You Can Imagine"),
            ("Colossians 3:17", "And whatever you do, whether in word or deed, do it all in the name of the Lord Jesus, giving thanks to God the Father through him.", "Signed in the Name of Jesus"),
            ("Hebrews 13:21", "May he equip you with everything good for doing his will, and may he work in us what is pleasing to him, through Jesus Christ.", "Equipped for Every Good Work"),
            ("Psalm 33:11", "But the plans of the Lord stand firm forever, the purposes of his heart through all generations.", "Purposes Standing Through Generations"),
            ("Luke 12:48", "From everyone who has been given much, much will be demanded; and from the one who has been entrusted with much, much more will be asked.", "The Weight of Holy Entrustment"),
            ("Romans 11:29", "For God’s gifts and his call are irrevocable.", "The Irrevocable Calling"),
            ("Philippians 3:14", "I press on toward the goal to win the prize for which God has called me heavenward in Christ Jesus.", "Pressing Toward the Upward Call"),
            ("Revelation 3:8", "I know your deeds. See, I have placed before you an open door that no one can shut.", "The Door No Human Can Shut")
        ]
    },
    {
        "month": 6,
        "name": "The Secret Place (Intimacy with God)",
        "days": 30,
        "start_day": 152,
        "theme_desc": "Dwelling in contemplation, prayer behind closed doors, hearing the gentle whisper, and abiding in the Vine.",
        "anchors": [
            ("Psalm 91:1", "Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.", "Under the Shadow of Shaddai"),
            ("Matthew 6:6", "But when you pray, go into your room, close the door and pray to your Father, who is unseen. Then your Father, who sees what is done in secret, will reward you.", "The Quiet Room Behind Closed Doors"),
            ("John 15:5", "I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.", "The Sap of the Living Vine"),
            ("Psalm 63:1", "You, God, are my God, earnestly I seek you; I thirst for you, my whole being longs for you, in a dry and parched land where there is no water.", "Thirsting in the Dry Wasteland"),
            ("1 Kings 19:12", "After the earthquake came a fire, but the Lord was not in the fire. And after the fire came a gentle whisper.", "The Gentle Whisper of the Father"),
            ("Exodus 33:14", "The Lord replied, 'My Presence will go with you, and I will give you rest.'", "The Assurance of His Presence"),
            ("Psalm 27:4", "One thing I ask from the Lord, this only do I seek: that I may dwell in the house of the Lord all the days of my life, to gaze on the beauty of the Lord.", "The One Thing That Matters"),
            ("Jeremiah 33:3", "Call to me and I will answer you and tell you great and unsearchable things you do not know.", "Calling into the Unsearchable"),
            ("Psalm 84:10", "Better is one day in your courts than a thousand elsewhere; I would rather be a doorkeeper in the house of my God than dwell in the tents of the wicked.", "Better is One Day in Your Courts"),
            ("James 4:8", "Come near to God and he will come near to you.", "The Reciprocal Draw of Heaven"),
            ("Song of Songs 2:10", "My beloved spoke and said to me, 'Arise, my darling, my beautiful one, come with me.'", "The Voice of the Beloved"),
            ("Psalm 42:1-2", "As the deer pants for streams of water, so my soul pants for you, my God. My soul thirsts for God, for the living God.", "Deep Thirst Panting for the Stream"),
            ("Luke 10:41-42", "Martha, Martha,' the Lord answered, 'you are worried and upset about many things, but few things are needed—or indeed only one. Mary has chosen what is better, and it will not be taken away from her.'", "Choosing the Better Portion"),
            ("Psalm 16:8", "I keep my eyes always on the Lord. With him at my right hand, I will not be shaken.", "Locked at His Right Hand"),
            ("John 14:21", "Whoever has my commands and keeps them is the one who loves me. The one who loves me will be loved by my Father, and I too will love them and show myself to them.", "The Manifest Presence Promised"),
            ("Psalm 25:14", "The Lord confides in those who fear him; he makes his covenant known to them.", "The Secret of the Lord Shared"),
            ("Revelation 3:20", "Here I am! I stand at the door and knock. If anyone hears my voice and opens the door, I will come in and eat with that person, and they with me.", "Dining Across the Threshold"),
            ("Psalm 139:7-10", "Where can I go from your Spirit? Where can I flee from your presence? If I go up to the heavens, you are there; if I make my bed in the depths, you are there.", "Nowhere Beyond His Reach"),
            ("Hosea 2:14", "Therefore I am now going to allure her; I will lead her into the wilderness and speak tenderly to her.", "Allured into the Wilderness of Love"),
            ("Psalm 100:4", "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.", "Crossing the Gates of Thanksgiving"),
            ("Mark 1:35", "Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed.", "Dawn in the Solitary Place"),
            ("Zechariah 2:5", "And I myself will be a wall of fire around it,' declares the Lord, 'and I will be its glory within.'", "A Wall of Fire Around You"),
            ("Psalm 46:4", "There is a river whose streams make glad the city of God, the holy place where the Most High dwells.", "The River That Makes Glad"),
            ("Isaiah 55:6", "Seek the Lord while he may be found; call on him while he is near.", "Seeking While He is Near"),
            ("Psalm 34:8", "Taste and see that the Lord is good; blessed is the one who takes refuge in him.", "Taste the Living Goodness"),
            ("John 10:27", "My sheep listen to my voice; I know them, and they follow me.", "Familiar with the Shepherd's Voice"),
            ("Psalm 73:28", "But as for me, it is good to be near God. I have made the Sovereign Lord my refuge.", "The Highest Good: Nearness to God"),
            ("Hebrews 10:22", "Let us draw near to God with a sincere heart and with the full assurance that faith brings.", "Drawing Near in Full Assurance"),
            ("Psalm 119:147", "I rise before dawn and cry for help; I have put my hope in your word.", "Preceding the Dawn in Prayer"),
            ("Jude 1:21", "Keep yourselves in God’s love as you wait for the mercy of our Lord Jesus Christ to bring you to eternal life.", "Anchored in the Stream of His Love")
        ]
    },
    {
        "month": 7,
        "name": "Healing, Restoration & Wholeness",
        "days": 31,
        "start_day": 182,
        "theme_desc": "Mending broken hearts, comfort in deep grief, bodily renewal, and restoration of what was stolen.",
        "anchors": [
            ("Psalm 147:3", "He heals the brokenhearted and binds up their wounds.", "Mender of the Fractured Heart"),
            ("Psalm 34:18", "The Lord is close to the brokenhearted and saves those who are crushed in spirit.", "Near to the Crushed in Spirit"),
            ("Isaiah 61:1-3", "He has sent me to bind up the brokenhearted, to proclaim freedom for the captives... to bestow on them a crown of beauty instead of ashes, the oil of joy instead of mourning.", "Beauty Crowned for Ashes"),
            ("1 Peter 2:24", "By his wounds you have been healed.", "By His Stripes We Are Whole"),
            ("Jeremiah 17:14", "Heal me, Lord, and I will be healed; save me and I will be saved, for you are the one I praise.", "The Cry for Deep Healing"),
            ("Psalm 103:2-3", "Praise the Lord, my soul, and forget not all his benefits—who forgives all your sins and heals all your diseases.", "Benefits of Restoration"),
            ("Matthew 11:28-30", "Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.", "The Gentle Yoke of Christ"),
            ("Joel 2:25", "I will repay you for the years the locusts have eaten.", "Restoring What Locusts Devoured"),
            ("Revelation 21:4", "He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain.", "Every Tear Wiped Clean"),
            ("Psalm 30:2", "Lord my God, I called to you for help, and you healed me.", "From Crying to Wholeness"),
            ("Jeremiah 30:17", "For I will restore health to you and heal you of your wounds,' says the Lord.", "Promised Recovery of Vitality"),
            ("Psalm 41:3", "The Lord sustains them on their sickbed and restores them from their bed of illness.", "Sustained in the Bed of Languishing"),
            ("Isaiah 53:4", "Surely he took up our pain and bore our suffering.", "The Burden-Bearer of Pain"),
            ("Psalm 23:3", "He refreshes my soul. He guides me along the right paths for his name’s sake.", "The Restorer of the Soul"),
            ("Malachi 4:2", "But for you who revere my name, the sun of righteousness will rise with healing in its rays.", "Rays of the Sun of Righteousness"),
            ("Mark 5:34", "He said to her, 'Daughter, your faith has healed you. Go in peace and be freed from your suffering.'", "Go in Unbroken Peace"),
            ("Exodus 15:26", "I am the Lord, who heals you.", "Jehovah Rapha Revealed"),
            ("Psalm 107:20", "He sent out his word and healed them; he rescued them from the grave.", "The Healing Word Sent Forth"),
            ("Proverbs 3:7-8", "Fear the Lord and shun evil. This will bring health to your body and nourishment to your bones.", "Marrow in the Bones"),
            ("James 5:15", "And the prayer offered in faith will make the sick person well; the Lord will raise them up.", "The Prayer of Holy Faith"),
            ("Luke 4:18", "The Spirit of the Lord is on me, because he has anointed me to proclaim good news to the poor... and recovery of sight to the blind, to set the oppressed free.", "Proclaiming Jubilee and Recovery"),
            ("Psalm 119:50", "My comfort in my suffering is this: Your promise preserves my life.", "Comfort in the Shadow of Suffering"),
            ("3 John 1:2", "Dear friend, I pray that you may enjoy good health and that all may go well with you, even as your soul is getting along well.", "Wholeness of Soul and Body"),
            ("Psalm 42:11", "Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God, for I will yet praise him, my Savior and my God.", "Speaking Truth to the Downcast Soul"),
            ("Romans 8:11", "And if the Spirit of him who raised Jesus from the dead is living in you, he who raised Christ from the dead will also give life to your mortal bodies because of his Spirit who lives in you.", "Resurrection Life in Mortal Flesh"),
            ("Isaiah 58:8", "Then your light will break forth like the dawn, and your healing will quickly appear.", "Healing Dawning as the Morning"),
            ("Psalm 126:5", "Those who sow with tears will reap with songs of joy.", "Reaping Harvests from Tears"),
            ("2 Kings 20:5", "I have heard your prayer and seen your tears; I will heal you.", "Heard Prayers, Observed Tears"),
            ("Proverbs 4:20-22", "My son, pay attention to what I say... for they are life to those who find them and health to one’s whole body.", "Medicine in the Scriptures"),
            ("John 5:6", "When Jesus saw him lying there and learned that he had been in this condition for a long time, he asked him, 'Do you want to get well?'", "The Courage to Be Made Well"),
            ("Psalm 116:8-9", "For you, Lord, have delivered me from death, my eyes from tears, my feet from stumbling, that I may walk before the Lord in the land of the living.", "Walking in the Land of the Living")
        ]
    },
    {
        "month": 8,
        "name": "Radical Forgiveness & Freedom",
        "days": 31,
        "start_day": 213,
        "theme_desc": "Releasing resentment, severing chains of bitterness, walking in gospel freedom, and blessing those who wounded you.",
        "anchors": [
            ("Galatians 5:1", "It is for freedom that Christ has set us free. Stand firm, then, and do not let yourselves be burdened again by a yoke of slavery.", "Unshackled from Slavery"),
            ("Colossians 3:13", "Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.", "Forgiving in the Measure You Were Forgiven"),
            ("Matthew 6:14-15", "For if you forgive other people when they sin against you, your heavenly Father will also forgive you.", "The Release That Frees the Releaser"),
            ("Ephesians 4:31-32", "Get rid of all bitterness, rage and anger, brawling and slander, along with every form of malice. Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.", "Extinguishing Bitter Roots"),
            ("Luke 6:37", "Do not judge, and you will not be judged. Do not condemn, and you will not be condemned. Forgive, and you will be forgiven.", "The Measure You Measure With"),
            ("Romans 12:19", "Do not take revenge, my dear friends, but leave room for God’s wrath, for it is written: 'It is mine to avenge; I will repay,' says the Lord.", "Leaving Vengeance to Sovereign Justice"),
            ("John 8:36", "So if the Son sets you free, you will be free indeed.", "Free Indeed: The Son's Liberty"),
            ("Psalm 103:10", "He does not treat us as our sins deserve or repay us according to our iniquities.", "Mercy Withholding What Was Deserved"),
            ("Proverbs 17:9", "Whoever would foster love covers over an offense, but whoever repeats the matter separates close friends.", "Covering Offenses in Love"),
            ("Matthew 18:21-22", "Lord, how many times shall I forgive my brother or sister who sins against me? Up to seven times?' Jesus answered, 'I tell you, not seven times, but seventy-seven times.'", "Seventy Times Seven"),
            ("2 Corinthians 3:17", "Now the Lord is the Spirit, and where the Spirit of the Lord is, there is freedom.", "Where the Spirit Breathes Freedom"),
            ("Romans 8:2", "Because through Christ Jesus the law of the Spirit who gives life has set you free from the law of sin and death.", "The Higher Law of the Spirit"),
            ("1 John 1:9", "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.", "Faithful and Just to Cleanse"),
            ("Romans 12:21", "Do not be overcome by evil, but overcome evil with good.", "Overcoming Darkness with Holy Good"),
            ("Luke 23:34", "Jesus said, 'Father, forgive them, for they do not know what they are doing.'", "Cruciform Forgiveness"),
            ("Psalm 32:1-2", "Blessed is the one whose transgressions are forgiven, whose sins are covered. Blessed is the one whose sin the Lord does not count against them.", "The Bliss of Transgressions Covered"),
            ("Isaiah 1:18", "Though your sins are like scarlet, they shall be as white as snow; though they are red as crimson, they shall be like wool.", "Snow-White Transformation"),
            ("Hebrews 12:15", "See to it that no one falls short of the grace of God and that no bitter root grows up to cause trouble and defile many.", "Uprooting the Poison of Bitterness"),
            ("Mark 11:25", "And when you stand praying, if you hold anything against anyone, forgive them, so that your Father in heaven may forgive you your sins.", "Clearing the Altar of Grudges"),
            ("Micah 7:19", "You will again have compassion on us; you will tread our sins underfoot and hurl all our iniquities into the depths of the sea.", "Hurtled into the Deepest Sea"),
            ("Proverbs 19:11", "A person’s wisdom yields patience; it is to one’s glory to overlook an offense.", "The Glory of Overlooking Slights"),
            ("Acts 13:38-39", "Through Jesus the forgiveness of sins is proclaimed to you. Through him everyone who believes is set free from every sin, a justification you were not able to obtain under the law of Moses.", "Freedom the Law Could Not Grant"),
            ("Genesis 50:20", "You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives.", "God Intended it for Good"),
            ("1 Peter 3:9", "Do not repay evil with evil or insult with insult. On the contrary, repay evil with blessing, because to this you were called so that you may inherit a blessing.", "Inheriting Blessing through Blessing"),
            ("Psalm 130:3-4", "If you, Lord, kept a record of sins, Lord, who could stand? But with you there is forgiveness, so that we can, with reverence, serve you.", "No Ledger of Past Debts"),
            ("Matthew 5:44", "Love your enemies and pray for those who persecute you.", "Praying for Those Who Wound"),
            ("Galatians 5:13", "You, my brothers and sisters, were called to be free. But do not use your freedom to indulge the flesh; rather, serve one another humbly in love.", "Freedom Expressed in Loving Service"),
            ("Romans 6:14", "For sin shall no longer be your master, because you are not under the law, but under grace.", "Grace Ousting the Slave Master"),
            ("Psalm 119:45", "I will walk about in freedom, for I have sought out your precepts.", "Walking the Wide Plains of Liberty"),
            ("Luke 15:20", "So he got up and went to his father. But while he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son, threw his arms around him and kissed him.", "The Father Running with Open Arms"),
            ("John 8:11", "'Neither do I condemn you,' Jesus declared. 'Go now and leave your life of sin.'", "Go and Live in Liberty")
        ]
    },
    {
        "month": 9,
        "name": "Wisdom, Discernment & Divine Guidance",
        "days": 30,
        "start_day": 244,
        "theme_desc": "Making godly choices at crossroads, receiving heaven's discernment, listening for God's voice, and walking in light.",
        "anchors": [
            ("James 1:5", "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.", "Heaven Gives Wisdom Generously"),
            ("Proverbs 3:5-6", "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", "Submitting the Compass to God"),
            ("Psalm 119:105", "Your word is a lamp for my feet, a light on my path.", "A Lantern for the Next Step"),
            ("Proverbs 4:7", "The beginning of wisdom is this: Get wisdom. Though it cost all you have, get understanding.", "The Supreme Pursuit of Wisdom"),
            ("Isaiah 30:21", "Whether you turn to the right or to the left, your ears will hear a voice behind you, saying, 'This is the way; walk in it.'", "The Voice Whispering: This is the Way"),
            ("Psalm 32:8", "I will instruct you and teach you in the way you should go; I will counsel you with my loving eye on you.", "Guided by His Loving Eye"),
            ("Proverbs 16:3", "Commit to the Lord whatever you do, and he will establish your plans.", "Committed Works, Established Plans"),
            ("James 3:17", "But the wisdom that comes from heaven is first of all pure; then peace-loving, considerate, submissive, full of mercy and good fruit, impartial and sincere.", "The Signature of Heavenly Wisdom"),
            ("Colossians 1:9", "We continually ask God to fill you with the knowledge of his will through all the wisdom and understanding that the Spirit gives.", "Filled with the Knowledge of His Will"),
            ("Proverbs 2:6", "For the Lord gives wisdom; from his mouth come knowledge and understanding.", "Wisdom Breathing from His Mouth"),
            ("Psalm 25:9", "He guides the humble in what is right and teaches them his way.", "Guiding the Teachable and Humble"),
            ("Ephesians 5:15-16", "Be very careful, then, how you live—not as unwise but as wise, making the most of every opportunity, because the days are evil.", "Redeeming the Precious Hours"),
            ("Proverbs 11:14", "For lack of guidance a nation falls, but victory is won through many advisers.", "The Safety of Wise Counsel"),
            ("Psalm 73:24", "You guide me with your counsel, and afterward you will take me into glory.", "Guided into Glory"),
            ("Proverbs 9:10", "The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding.", "Reverence: The Genesis of Wisdom"),
            ("Ecclesiastes 3:1", "There is a time for everything, and a season for every activity under the heavens.", "Discerning Heaven's Kairos Time"),
            ("1 Kings 3:9", "So give your servant a discerning heart to govern your people and to distinguish between right and wrong.", "The Gift of a Discerning Heart"),
            ("Psalm 143:10", "Teach me to do your will, for you are my God; may your good Spirit lead me on level ground.", "Led onto Level Ground"),
            ("Proverbs 15:22", "Plans fail for lack of counsel, but with many advisers they succeed.", "Strengthening Plans with Discernment"),
            ("Romans 12:2", "Then you will be able to test and approve what God’s will is—his good, pleasing and perfect will.", "Proving the Perfect Will"),
            ("Psalm 37:23", "The Lord makes firm the steps of the one who delights in him.", "Steps Made Firm by Delight"),
            ("Proverbs 27:17", "As iron sharpens iron, so one person sharpens another.", "The Sharpening of Community"),
            ("Daniel 2:22", "He reveals deep and hidden things; he knows what lies in darkness, and light dwells with him.", "Revealer of Hidden Depths"),
            ("Psalm 119:130", "The unfolding of your words gives light; it gives understanding to the simple.", "Light Unfolded from the Word"),
            ("Proverbs 13:20", "Walk with the wise and become wise, for a companion of fools suffers harm.", "Walking with the Wise"),
            ("Isaiah 48:17", "I am the Lord your God, who teaches you what is best for you, who directs you in the way you should go.", "Taught What is Profitable"),
            ("Psalm 111:10", "The fear of the Lord is the beginning of wisdom; all who follow his precepts have good understanding.", "Living with Reverent Insight"),
            ("1 Corinthians 2:10", "These are the things God has revealed to us by his Spirit. The Spirit searches all things, even the deep things of God.", "Searching the Deep Things of Heaven"),
            ("Proverbs 24:3-4", "By wisdom a house is built, and through understanding it is established; through knowledge its rooms are filled with rare and beautiful treasures.", "A House Built on Understanding"),
            ("Psalm 16:7", "I will praise the Lord, who counsels me; even at night my heart instructs me.", "Counsel in the Night Seasons")
        ]
    },
    {
        "month": 10,
        "name": "Work, Fruitfulness & Kingdom Stewardship",
        "days": 31,
        "start_day": 274,
        "theme_desc": "Honoring God in career, cultivating excellence, wise financial stewardship, multiplying talents, and working for an audience of One.",
        "anchors": [
            ("Colossians 3:23-24", "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters, since you know that you will receive an inheritance from the Lord as a reward. It is the Lord Christ you are serving.", "Working for the Audience of One"),
            ("Proverbs 16:3", "Commit to the Lord whatever you do, and he will establish your plans.", "Holy Consecration of Labor"),
            ("Matthew 25:21", "His master replied, 'Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things. Come and share your master’s happiness!'", "Faithful in the Small Stewarded Things"),
            ("2 Corinthians 9:8", "And God is able to bless you abundantly, so that in all things at all times, having all that you need, you will abound in every good work.", "Abounding in Every Good Work"),
            ("Psalm 90:17", "May the favor of the Lord our God rest on us; establish the work of our hands for us—yes, establish the work of our hands.", "Favor Establishing Your Hands"),
            ("Proverbs 3:9-10", "Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing.", "Firstfruits and Holy Provision"),
            ("1 Corinthians 15:58", "Therefore, my dear brothers and sisters, stand firm. Let nothing move you. Always give yourselves fully to the work of the Lord, because you know that your labor in the Lord is not in vain.", "Labor in Christ is Never in Vain"),
            ("Luke 16:10", "Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.", "The Test of Little Things"),
            ("Ecclesiastes 3:13", "That each of them may eat and drink, and find satisfaction in all their toil—this is the gift of God.", "The Sacred Gift of Satisfaction"),
            ("Proverbs 10:4", "Lazy hands make for poverty, but diligent hands bring wealth.", "The Dignity of Diligent Hands"),
            ("Matthew 6:33", "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", "Seeking the Kingdom First"),
            ("Philippians 4:19", "And my God will meet all your needs according to the riches of his glory in Christ Jesus.", "Supplied by Riches of Glory"),
            ("Deuteronomy 8:18", "But remember the Lord your God, for it is he who gives you the ability to produce wealth.", "The Power to Create Value"),
            ("Proverbs 22:29", "Do you see someone skilled in their work? They will serve before kings; they will not serve before officials of low rank.", "Excellence Standing Before Kings"),
            ("Galatians 6:9", "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.", "A Harvest at the Appointed Time"),
            ("Malachi 3:10", "Bring the whole tithe into the storehouse... and see if I will not throw open the floodgates of heaven and pour out so much blessing that there will not be room enough to store it.", "Open Windows of Heaven"),
            ("1 Timothy 6:6", "But godliness with contentment is great gain.", "The Wealth of Holy Contentment"),
            ("Psalm 128:2", "You will eat the fruit of your labor; blessings and prosperity will be yours.", "The Sweet Fruit of Honest Labor"),
            ("Proverbs 21:5", "The plans of the diligent lead to profit as surely as haste leads to poverty.", "Diligence Over Reckless Haste"),
            ("Romans 12:11", "Never be lacking in zeal, but keep your spiritual fervor, serving the Lord.", "Spiritual Fervor in Daily Routine"),
            ("Hebrews 6:10", "God is not unjust; he will not forget your work and the love you have shown him as you have helped his people and continue to help them.", "Unforgotten Acts of Love"),
            ("Proverbs 11:25", "A generous person will prosper; whoever refreshes others will be refreshed.", "The Soul That Refreshes Others"),
            ("1 Thessalonians 4:11", "And to make it your ambition to lead a quiet life: You should mind your own business and work with your hands.", "The Quiet Dignity of Daily Work"),
            ("Psalm 37:25", "I was young and now I am old, yet I have never seen the righteous forsaken or their children begging bread.", "The Righteous Never Forsaken"),
            ("Matthew 5:16", "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.", "Shining in the Marketplace"),
            ("Proverbs 14:23", "All hard work brings a profit, but mere talk leads only to poverty.", "Labor Rather Than Mere Words"),
            ("Ephesians 4:28", "Anyone who has been stealing must steal no longer, but must work, doing something useful with their own hands, that they may have something to share with those in need.", "Working in Order to Give"),
            ("2 Corinthians 8:9", "For you know the grace of our Lord Jesus Christ, that though he was rich, yet for your sake he became poor, so that you through his poverty might become rich.", "Rich in Eternal Grace"),
            ("Psalm 1:3", "That person is like a tree planted by streams of water, which yields its fruit in season and whose leaf does not wither—whatever they do prospers.", "Fruitful in Every Season"),
            ("1 Timothy 6:17-18", "Command those who are rich in this present world not to be arrogant nor to put their hope in wealth... but to put their hope in God... to do good, to be rich in good deeds, and to be generous and willing to share.", "Rich in Good Deeds and Generosity"),
            ("Genesis 39:3", "When his master saw that the Lord was with him and that the Lord gave him success in everything he did, Joseph found favor.", "The Joseph Anointing in Work")
        ]
    },
    {
        "month": 11,
        "name": "Family, Grace & Covenant Love",
        "days": 30,
        "start_day": 305,
        "theme_desc": "Christlike love in the home, marriage covenant, raising children in faith, healing family rifts, and deep biblical community.",
        "anchors": [
            ("1 Corinthians 13:4-7", "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.", "The Unconditional Nature of Agapé"),
            ("Joshua 24:15", "But as for me and my household, we will serve the Lord.", "As for Me and My House"),
            ("1 Peter 4:8", "Above all, love each other deeply, because love covers over a multitude of sins.", "Love Covering Faults"),
            ("Ephesians 4:2-3", "Be completely humble and gentle; be patient, bearing with one another in love. Make every effort to keep the unity of the Spirit through the bond of peace.", "The Bond of Gentle Peace"),
            ("Colossians 3:12-14", "Therefore, as God’s chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience... And over all these virtues put on love, which binds them all together in perfect unity.", "Clothed in Tenderness"),
            ("Proverbs 22:6", "Start children off on the way they should go, and even when they are old they will not turn from it.", "Guiding Young Steps in Truth"),
            ("Psalm 127:1", "Unless the Lord builds the house, the builders labor in vain. Unless the Lord watches over the city, the guards stand watch in vain.", "Unless the Lord Builds the Home"),
            ("Ephesians 5:25", "Husbands, love your wives, just as Christ loved the church and gave himself up for her.", "Sacrificial, Christlike Love"),
            ("Proverbs 31:26", "She speaks with wisdom, and faithful instruction is on her tongue.", "Wisdom on the Tongue of Grace"),
            ("Psalm 128:3", "Your wife will be like a fruitful vine within your house; your children will be like olive shoots around your table.", "Olive Shoots Around the Hearth"),
            ("1 John 4:19", "We love because he first loved us.", "The Fountainhead of Love"),
            ("Ephesians 6:4", "Fathers, do not exasperate your children; instead, bring them up in the training and instruction of the Lord.", "Nurturing Without Exasperation"),
            ("Proverbs 17:17", "A friend loves at all times, and a brother is born for a time of adversity.", "Brother Born for Adversity"),
            ("Romans 12:10", "Be devoted to one another in love. Honor one another above yourselves.", "Outdoing One Another in Honor"),
            ("Psalm 133:1", "How good and pleasant it is when God’s people live together in unity!", "The Fragrance of Brotherly Unity"),
            ("Ecclesiastes 4:12", "Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken.", "The Cord of Three Strands"),
            ("Ephesians 4:26", "Do not let the sun go down while you are still angry.", "Settling Wrath Before Twilight"),
            ("Proverbs 15:1", "A gentle answer turns away wrath, but a harsh word stirs up anger.", "The Power of a Gentle Answer"),
            ("Deuteronomy 6:6-7", "These commandments that I give you today are to be on your hearts. Impress them on your children. Talk about them when you sit at home and when you walk along the road.", "Talking of God on the Journey"),
            ("1 Thessalonians 5:11", "Therefore encourage one another and build each other up, just as in fact you are doing.", "Building Up One Another Daily"),
            ("1 Corinthians 13:13", "And now these three remain: faith, hope and love. But the greatest of these is love.", "The Crown of Christian Virtues"),
            ("Psalm 103:17", "But from everlasting to everlasting the Lord’s love is with those who fear him, and his righteousness with their children’s children.", "Generational Righteousness"),
            ("Ruth 1:16", "Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.", "The Covenant of Loyalty"),
            ("Hebrews 10:24-25", "And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together.", "Spurring One Another to Good Deeds"),
            ("Proverbs 18:24", "One who has unreliable friends soon comes to ruin, but there is a friend who sticks closer than a brother.", "The Friend Closer Than a Brother"),
            ("1 Peter 3:7", "Husbands, in the same way be considerate as you live with your wives, and treat them with respect as the weaker partner and as heirs with you of the gracious gift of life.", "Heirs of the Gracious Gift"),
            ("Galatians 6:2", "Carry each other’s burdens, and in this way you will fulfill the law of Christ.", "Carrying One Another's Weight"),
            ("Colossians 3:20", "Children, obey your parents in everything, for this pleases the Lord.", "Honor That Pleases the Lord"),
            ("Psalm 68:6", "God sets the lonely in families, he leads out the prisoners with singing.", "Setting the Solitary in Families"),
            ("John 13:34-35", "A new command I give you: Love one another. As I have loved you, so you must love one another. By this everyone will know that you are my disciples, if you love one another.", "The Unmistakable Mark of Discipleship")
        ]
    },
    {
        "month": 12,
        "name": "Unshakeable Hope, Gratitude & Eternity",
        "days": 31,
        "start_day": 335,
        "theme_desc": "Finishing the race with praise, cultivating relentless thanksgiving, an eternal kingdom perspective, and holy anticipation of Christ.",
        "anchors": [
            ("Lamentations 3:22-23", "Because of the Lord’s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.", "New Mercies with Every Rising Sun"),
            ("Psalm 103:1-2", "Praise the Lord, my soul; all my inmost being, praise his holy name. Praise the Lord, my soul, and forget not all his benefits.", "Awakening Your Inmost Praise"),
            ("1 Thessalonians 5:16-18", "Rejoice always, pray continually, give thanks in all circumstances; for this is God’s will for you in Christ Jesus.", "Thanksgiving in Every Season"),
            ("Romans 15:13", "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.", "Overflowing with Heaven's Hope"),
            ("Psalm 100:1-3", "Shout for joy to the Lord, all the earth. Worship the Lord with gladness; come before him with joyful songs. Know that the Lord is God. It is he who made us, and we are his.", "The Joyful Shout of Belonging"),
            ("Colossians 2:6-7", "So then, just as you received Christ Jesus as Lord, continue to live your lives in him, rooted and built up in him, strengthened in the faith as you were taught, and overflowing with thankfulness.", "Rooted and Overflowing with Gratitude"),
            ("Revelation 21:3-4", "Look! God’s dwelling place is now among the people, and he will dwell with them... He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain.", "The Dwelling Place of God with Man"),
            ("Hebrews 6:19", "We have this hope as an anchor for the soul, firm and secure. It enters the inner sanctuary behind the curtain.", "The Soul's Unshakeable Anchor"),
            ("Psalm 107:1", "Give thanks to the Lord, for he is good; his love endures forever.", "Enduring Love That Outlasts Time"),
            ("Isaiah 9:6", "For to us a child is born, to us a son is given, and the government will be on his shoulders. And he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.", "The Prince of Eternal Peace"),
            ("1 Peter 1:3", "Praise be to the God and Father of our Lord Jesus Christ! In his great mercy he has given us new birth into a living hope through the resurrection of Jesus Christ from the dead.", "A Living, Undying Hope"),
            ("Psalm 30:5", "For his anger lasts only a moment, but his favor lasts a lifetime; weeping may stay for the night, but rejoicing comes in the morning.", "Rejoicing on the Horizon of Dawn"),
            ("Romans 8:18", "I consider that our present sufferings are not worth comparing with the glory that will be revealed in us.", "Glory Outweighing Present Trials"),
            ("2 Corinthians 4:16-17", "Therefore we do not lose heart. Though outwardly we are wasting away, yet inwardly we are being renewed day by day. For our light and momentary troubles are achieving for us an eternal glory that far outweighs them all.", "The Eternal Weight of Glory"),
            ("Philippians 3:20", "But our citizenship is in heaven. And we eagerly await a Savior from there, the Lord Jesus Christ.", "Citizens of the Unseen Kingdom"),
            ("Psalm 118:24", "The Lord has done it this very day; let us rejoice today and be glad.", "Rejoicing in This Very Day"),
            ("Titus 2:13", "While we wait for the blessed hope—the appearing of the glory of our great God and Savior, Jesus Christ.", "The Blessed Hope on the Horizon"),
            ("Psalm 71:14", "As for me, I will always have hope; I will praise you more and more.", "Always Abounding in Hope"),
            ("Revelation 22:20", "He who testifies to these things says, 'Yes, I am coming soon.' Amen. Come, Lord Jesus.", "Even So, Come Lord Jesus"),
            ("Psalm 150:6", "Let everything that has breath praise the Lord. Praise the Lord.", "Every Breath an Offering"),
            ("1 Corinthians 2:9", "What no eye has seen, what no ear has heard, and what no human mind has conceived'—the things God has prepared for those who love him.", "Prepared by Infinite Love"),
            ("Psalm 34:1", "I will extol the Lord at all times; his praise will always be on my lips.", "Praise Continually on the Lips"),
            ("Habakkuk 2:3", "For the revelation awaits an appointed time; it speaks of the end and will not prove false. Though it linger, wait for it; it will certainly come and will not delay.", "Wait for the Appointed Dawn"),
            ("Luke 2:14", "Glory to God in the highest heaven, and on earth peace to those on whom his favor rests.", "Peace to Hearts of Goodwill"),
            ("John 14:1-3", "Do not let your hearts be troubled. You believe in God; believe also in me. My Father’s house has many rooms... I am going there to prepare a place for you.", "A Room Prepared in the Father's House"),
            ("Psalm 9:1", "I will give thanks to you, Lord, with all my heart; I will tell of all your wonderful deeds.", "Recounting His Wonders with All the Heart"),
            ("Romans 8:38-39", "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.", "Inseparable from Sovereign Love"),
            ("Hebrews 11:16", "Instead, they were longing for a better country—a heavenly one. Therefore God is not ashamed to be called their God, for he has prepared a city for them.", "Longing for the Heavenly City"),
            ("Psalm 92:1-2", "It is good to praise the Lord and make music to your name, O Most High, proclaiming your love in the morning and your faithfulness at night.", "Love at Morning, Faithfulness at Night"),
            ("Revelation 21:5", "He who was seated on the throne said, 'I am making everything new!'", "Behold, I Make All Things New"),
            ("Jude 1:24-25", "To him who is able to keep you from stumbling and to present you before his glorious presence without fault and with great joy—to the only God our Savior be glory, majesty, power and authority, through Jesus Christ our Lord, before all ages, now and forevermore! Amen.", "Presented Faultless with Great Joy")
        ]
    }
]

def generate_devotional_entry(day_num, anchor, season):
    verse_ref, verse_text, title = anchor
    
    # Detailed theological reflection and practical interactive micro-practice
    reflection = (
        f"In every season of life, God's Word arrives not merely as advice, but as a living anchor for the human soul. "
        f"Today, in the context of {season['name'].lower()}, the truth of {verse_ref} invites you to shift your focus "
        f"away from momentary anxieties and onto the enduring character of God.\n\n"
        f"Consider what is currently contending for your peace. Our natural inclination is often to strive in our own strength, "
        f"to manage every outcome, or to replay yesterday's missteps. Yet scripture declares: \"{verse_text}\" "
        f"When you absorb this promise, your perspective transforms from human scarcity to heavenly abundance. "
        f"God is already present in your tomorrow, orchestrating every circumstance with unfailing wisdom and grace.\n\n"
        f"**Today's Interactive Practice:** Pause right now for sixty seconds. Inhale deeply through your nose, acknowledging God's breath in your lungs. "
        f"As you slowly exhale, surrender the one situation you have been trying to control today. Whisper quietly: "
        f"'Lord, I trust Your heart, I stand on {verse_ref}, and I walk in Your peace.'"
    )
    
    prayer = (
        f"Heavenly Father, I come before You today with an open heart, grateful for the living power of Your Word in {verse_ref}. "
        f"Forgive me for the moments I allow worry or self-reliance to cloud my vision of Your goodness. "
        f"Holy Spirit, anchor my thoughts in the truth that {verse_text.lower()} "
        f"Grant me discernment to recognize Your guidance, courage to walk by faith, and a spirit overflowed with gratitude. "
        f"I dedicate my words, my work, and my relationships today to Your glory. In the mighty name of Jesus, Amen."
    )
    
    return {
        "id": str(uuid.uuid4()),
        "dayNumber": day_num,
        "title": title,
        "durationMinutes": 3,
        "verseReference": verse_ref,
        "verseText": verse_text,
        "reflectionText": reflection,
        "prayerText": prayer
    }

def main():
    all_devotionals = []
    
    for season in SEASONS:
        days_in_season = season["days"]
        anchors = season["anchors"]
        start_day = season["start_day"]
        
        for i in range(days_in_season):
            day_num = start_day + i
            anchor = anchors[i % len(anchors)]
            devotional = generate_devotional_entry(day_num, anchor, season)
            all_devotionals.append(devotional)
            
    print(f"Generated {len(all_devotionals)} devotionals.")
    
    with open("devotionals-365.json", "w", encoding="utf-8") as f:
        json.dump(all_devotionals, f, indent=2, ensure_ascii=False)
        
    print("Saved to devotionals-365.json successfully.")

if __name__ == "__main__":
    main()
