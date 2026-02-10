
import json
import random

# Categories and Difficulty
CATEGORIES = ["genel_kultur"]
TAGS_BASE = ["modern", "guncel", "teknoloji"]

def create_question(id_num, question, answers, correct_idx, difficulty, extra_tags=None):
    tags = TAGS_BASE.copy()
    if extra_tags:
        tags.extend(extra_tags)
    
    return {
        "id": id_num,
        "question": question,
        "answers": answers,
        "correctAnswer": correct_idx,
        "category": "genel_kultur",
        "difficulty": difficulty,
        "tags": tags
    }

questions = []
id_counter = 54000 

# ==============================================================================
# TECHNOLOGY & INTERNET (30)
# ==============================================================================

tech_questions = [
    ("2022'de Twitter'ı 44 milyar dolara satın alan ünlü girişimci kimdir?", ["Elon Musk", "Jeff Bezos", "Mark Zuckerberg", "Bill Gates"], 0, "kolay", ["teknoloji", "gundem"]),
    ("Yapay zeka sohbet robotu ChatGPT'yi geliştiren şirketin adı nedir?", ["OpenAI", "DeepMind", "Google", "Meta"], 0, "kolay", ["teknoloji", "ai"]),
    ("Metaverse kavramını popülerleştiren ve Facebook'un adını değiştiren şirket hangisidir?", ["Meta", "Alphabet", "Amazon", "Microsoft"], 0, "kolay", ["teknoloji", "internet"]),
    ("Bitcoin'in kimliği bilinmeyen gizemli yaratıcısı kimdir?", ["Satoshi Nakamoto", "Vitalik Buterin", "Gavin Andresen", "Ross Ulbricht"], 0, "orta", ["teknoloji", "kripto"]),
    ("Dünyanın en popüler video paylaşım platformu YouTube, hangi yıl kurulmuştur?", ["2005", "2000", "2010", "1998"], 0, "orta", ["teknoloji", "internet"]),
    ("Apple'ın kurucularından olan ve 2011'de hayatını kaybeden vizyoner lider kimdir?", ["Steve Jobs", "Steve Wozniak", "Tim Cook", "Bill Gates"], 0, "kolay", ["teknoloji", "tarih"]),
    ("Instagram'ın 'Hikayeler' (Stories) özelliğini kopyaladığı iddia edilen uygulama hangisidir?", ["Snapchat", "TikTok", "Vine", "Periscope"], 0, "kolay", ["teknoloji", "sosyal_medya"]),
    ("Dünyanın en çok noktasına uçan hava yolu şirketi (ülke sayısı bakımından) hangisidir?", ["Türk Hava Yolları", "Emirates", "Lufthansa", "American Airlines"], 0, "orta", ["gundem", "ulasim"]),
    ("Netflix'in dünya çapında fenomen olan Güney Kore yapımı dizisi hangisidir?", ["Squid Game", "Parasite", "Hellbound", "All of Us Are Dead"], 0, "kolay", ["pop_kultur", "dizi"]),
    ("Kısa video paylaşım uygulaması TikTok hangi ülkenin girişimidir?", ["Çin", "ABD", "Japonya", "Güney Kore"], 0, "kolay", ["teknoloji", "sosyal_medya"]),
    ("Uzaya ticari turist taşıyan ve Jeff Bezos'un sahibi olduğu şirketin adı nedir?", ["Blue Origin", "SpaceX", "Virgin Galactic", "Boeing"], 0, "orta", ["uzay", "teknoloji"]),
    ("Mars'a insan göndermeyi hedefleyen SpaceX şirketinin kurucusu kimdir?", ["Elon Musk", "Richard Branson", "Jeff Bezos", "Peter Thiel"], 0, "kolay", ["uzay", "teknoloji"]),
    ("Elektrikli otomobil üreticisi Tesla'nın ürettiği ilk 'pickup' modelinin adı nedir?", ["Cybertruck", "Model X", "Roadster", "Semi"], 0, "orta", ["otomotiv", "teknoloji"]),
    ("Amazon'un kurucusu ve uzun süre dünyanın en zengin insanı olan kişi kimdir?", ["Jeff Bezos", "Elon Musk", "Bill Gates", "Warren Buffett"], 0, "kolay", ["teknoloji", "ekonomi"]),
    ("Android işletim sisteminin geliştiricisi hangi şirkettir?", ["Google", "Apple", "Samsung", "Microsoft"], 0, "kolay", ["teknoloji", "yazilim"]),
    ("Dünyanın ilk trilyon dolarlık şirketi hangisidir?", ["Apple", "Microsoft", "Amazon", "Saudi Aramco"], 0, "orta", ["ekonomi", "teknoloji"]),
    ("Wikipedia'nın kurucusu kimdir?", ["Jimmy Wales", "Julian Assange", "Larry Page", "Sergey Brin"], 0, "zor", ["internet", "bilgi"]),
    ("Kripto para piyasasında Bitcoin'den sonra en büyük piyasa değerine sahip olan para birimi hangisidir?", ["Ethereum", "Ripple", "Litecoin", "Dogecoin"], 0, "orta", ["kripto", "finans"]),
    ("Bir NFT (Non-Fungible Token) satın aldığınızda aslında neye sahip olursunuz?", ["Dijital mülkiyet sertifikasına", "Telif hakkına", "Fiziksel bir esere", "Şirket hissesine"], 0, "orta", ["kripto", "sanat"]),
    ("Google'ın çatı şirketi olan ve borsada işlem gören holdingin adı nedir?", ["Alphabet", "Google Inc.", "Silicon Valley", "Beta"], 0, "orta", ["teknoloji", "ekonomi"]),
    ("Hangisi Elon Musk'ın şirketlerinden biri değildir?", ["Amazon", "Tesla", "SpaceX", "Neuralink"], 0, "kolay", ["teknoloji", "gundem"]),
    ("Dünyaca ünlü 'League of Legends' oyununun yapımcısı olan şirket hangisidir?", ["Riot Games", "Blizzard", "Valve", "Ubisoft"], 0, "orta", ["oyun", "espor"]),
    ("Whatsapp uygulaması 2014 yılında hangi şirket tarafından satın alınmıştır?", ["Facebook (Meta)", "Google", "Apple", "Microsoft"], 0, "kolay", ["teknoloji", "satin_alma"]),
    ("Hangisi bir Apple ürünü değildir?", ["Galaxy", "iPhone", "iPad", "MacBook"], 0, "kolay", ["teknoloji", "urun"]),
    ("Sanal gerçeklik gözlüğü 'Oculus' hangi şirkete aittir?", ["Meta (Facebook)", "Sony", "HTC", "Samsung"], 0, "orta", ["teknoloji", "vr"]),
    ("Türkiye'nin ürettiği yerli elektrikli otomobilin markası nedir?", ["Togg", "Devrim", "Anadol", "Toros"], 0, "kolay", ["teknoloji", "otomotiv"]),
    ("Spotify hangi ülkenin girişimidir?", ["İsveç", "ABD", "Almanya", "İngiltere"], 0, "orta", ["muzik", "teknoloji"]),
    ("Uber uygulamasının temel işlevi nedir?", ["Ulaşım / Taksi", "Yemek Siparişi", "Otel Rezervasyonu", "Arkadaşlık"], 0, "kolay", ["uygulama", "yasam"]),
    ("Airbnb uygulaması ne için kullanılır?", ["Konaklama kiralama", "Uçak bileti", "Araç kiralama", "Etkinlik bileti"], 0, "kolay", ["seyahat", "uygulama"]),
    ("İnternet sitelerinin güvenli olduğunu gösteren 'HTTPS' protokolündeki 'S' harfi ne anlama gelir?", ["Secure (Güvenli)", "System (Sistem)", "Speed (Hız)", "Site"], 0, "orta", ["internet", "yazilim"]),
]

for q, a, c_idx, diff, xtra in tech_questions:
    questions.append(create_question(id_counter, q, a, c_idx, diff, xtra))
    id_counter += 1

# ==============================================================================
# WORLD EVENTS & NEWS (Post-2000, Non-TR) (30)
# ==============================================================================

world_questions = [
    ("2020 yılında başlayan ve tüm dünyayı etkisi altına alan salgın hastalığın adı nedir?", ["COVID-19", "SARS", "MERS", "Ebola"], 0, "kolay", ["saglik", "gundem"]),
    ("İngiltere'nin Avrupa Birliği'nden ayrılması sürecine ne ad verilmiştir?", ["Brexit", "Grexit", "Euroexit", "Englateral"], 0, "kolay", ["siyaset", "avrupa"]),
    ("ABD'nin ilk siyahi başkanı kimdir?", ["Barack Obama", "Martin Luther King", "Nelson Mandela", "Colin Powell"], 0, "kolay", ["siyaset", "abd"]),
    ("2011 yılında Arap dünyasında başlayan halk ayaklanmalarına ne ad verilir?", ["Arap Baharı", "Arap Uyanışı", "Ortadoğu Devrimi", "Çöl Fırtınası"], 0, "orta", ["tarih", "siyaset"]),
    ("Rusya ile Ukrayna arasındaki büyük çaplı savaş hangi yıl başlamıştır?", ["2022", "2014", "2020", "2018"], 0, "kolay", ["siyaset", "savas"]),
    ("Japonya'nın Fukuşima Nükleer Santrali kazası hangi yıl yaşanmıştır?", ["2011", "2005", "1986", "2015"], 0, "orta", ["felaket", "tarih"]),
    ("Amerikan Ulusal Güvenlik Kurumu (NSA) belgelerini sızdıran ünlü ifşacı kimdir?", ["Edward Snowden", "Julian Assange", "Chelsea Manning", "Glenn Greenwald"], 0, "zor", ["gundem", "casusluk"]),
    ("WikiLeaks'in kurucusu olan ve uzun süre Ekvador büyükelçiliğinde yaşayan kişi kimdir?", ["Julian Assange", "Edward Snowden", "Aaron Swartz", "Mark Zuckerberg"], 0, "orta", ["internet", "siyaset"]),
    ("Notre Dame Katedrali yangını hangi şehirde gerçekleşmiştir?", ["Paris", "Londra", "Roma", "Barselona"], 0, "kolay", ["olay", "avrupa"]),
    ("2001 yılında İkiz Kuleler saldırısı hangi şehirde gerçekleşmiştir?", ["New York", "Washington", "Los Angeles", "Chicago"], 0, "kolay", ["tarih", "teror"]),
    ("Güney Sudan, hangi yılda bağımsızlığını ilan ederek dünyanın en genç ülkesi olmuştur?", ["2011", "2005", "2015", "2000"], 0, "zor", ["cografya", "siyaset"]),
    ("İklim aktivisti Greta Thunberg hangi ülkenin vatandaşıdır?", ["İsveç", "Norveç", "Almanya", "Danimarka"], 0, "orta", ["cevre", "aktivizm"]),
    ("Kraliçe II. Elizabeth kaç yıl tahtta kaldıktan sonra 2022'de vefat etmiştir?", ["70", "60", "50", "80"], 0, "orta", ["kraliyet", "ingiltere"]),
    ("Avrupa Birliği'nin ortak para birimi Euro, fiziksel olarak (banknot ve madeni para) hangi yıl tedavüle girmiştir?", ["2002", "1999", "2005", "1995"], 0, "zor", ["ekonomi", "avrupa"]),
    ("Suriye iç savaşı hangi yıl başlamıştır?", ["2011", "2013", "2009", "2015"], 0, "orta", ["savas", "ortadogu"]),
    ("2019 yılında ilk kez fotoğrafı çekilen gök cismi nedir?", ["Kara Delik", "Nötron Yıldızı", "Ötegezegen", "Beyaz Cüce"], 0, "orta", ["bilim", "uzay"]),
    ("COVID-19 aşısını (mRNA) geliştiren BioNTech şirketinin kurucuları kimlerdir?", ["Uğur Şahin & Özlem Türeci", "Aziz Sancar", "Canan Dağdeviren", "Gökhan Hotamışlıgil"], 0, "kolay", ["bilim", "turkler"]),
    ("Hangi ülke 2016 yılında Avrupa Futbol Şampiyonası'nı (EURO 2016) kazanmıştır?", ["Portekiz", "Fransa", "Almanya", "İspanya"], 0, "zor", ["spor", "futbol"]),
    ("2020 Olimpiyatları, pandemi nedeniyle hangi yıl düzenlenmiştir?", ["2021", "2022", "İptal edildi", "2020"], 0, "kolay", ["spor", "olimpiyat"]),
    ("Ever Given adlı dev gemi 2021 yılında hangi kanalı tıkayarak dünya ticaretini aksatmıştır?", ["Süveyş Kanalı", "Panama Kanalı", "Kiel Kanalı", "Korint Kanalı"], 0, "kolay", ["ekonomi", "olay"]),
    ("Paris İklim Anlaşması hangi yıl imzalanmıştır?", ["2015", "2010", "2020", "2005"], 0, "zor", ["cevre", "siyaset"]),
    ("Hangi ülke 2022 FIFA Dünya Kupası'na ev sahipliği yapmıştır?", ["Katar", "Rusya", "Brezilya", "Güney Afrika"], 0, "kolay", ["spor", "futbol"]),
    ("Dünyanın en yüksek binası Burj Khalifa hangi şehirdedir?", ["Dubai", "Abu Dhabi", "Riyad", "Doha"], 0, "kolay", ["mimari", "sehir"]),
    ("2004 yılında gerçekleşen büyük tsunami felaketi en çok hangi bölgeyi etkilemiştir?", ["Güneydoğu Asya (Hint Okyanusu)", "Karayipler", "Japonya", "Akdeniz"], 0, "orta", ["felaket", "cografya"]),
    ("Hangi gezegen 2006 yılında gezegen statüsünden çıkarılmıştır?", ["Plüton", "Neptün", "Merkür", "Mars"], 0, "kolay", ["bilim", "uzay"]),
    ("Apple'ın ilk iPhone modelini tanıttığı yıl hangisidir?", ["2007", "2005", "2010", "2003"], 0, "orta", ["teknoloji", "tarih"]),
    ("NASA'nın Mars'a gönderdiği ve 2021'de iniş yapan keşif aracının adı nedir?", ["Perseverance", "Curiosity", "Opportunity", "Spirit"], 0, "orta", ["uzay", "bilim"]),
    ("Kadınlara otomobil kullanma iznini en son veren ülke hangisidir (2018)?", ["Suudi Arabistan", "İran", "Afganistan", "Katar"], 0, "orta", ["kultur", "yasa"]),
    ("Türkiye'nin ilk astronotu Alper Gezeravcı hangi yıl uzaya gitmiştir?", ["2024", "2023", "2025", "2022"], 0, "kolay", ["gundem", "uzay"]),
    ("Eurovision 2023 şarkı yarışmasını hangi ülke kazanmıştır?", ["İsveç (Loreen)", "Finlandiya", "Ukrayna", "İtalya"], 0, "orta", ["muzik", "yarisma"]),
]

for q, a, c_idx, diff, xtra in world_questions:
    questions.append(create_question(id_counter, q, a, c_idx, diff, xtra))
    id_counter += 1

# ==============================================================================
# POP CULTURE & ENTERTAINMENT (30)
# ==============================================================================

pop_questions = [
    ("'Game of Thrones' dizisi hangi yazarın kitaplarından uyarlanmıştır?", ["George R.R. Martin", "J.R.R. Tolkien", "J.K. Rowling", "Stephen King"], 0, "kolay", ["dizi", "edebiyat"]),
    ("Marvel Sinematik Evreni'nde 'Iron Man' karakterini canlandıran oyuncu kimdir?", ["Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"], 0, "kolay", ["sinema", "marvel"]),
    ("Oscar töreninde sunucu Chris Rock'a tokat atan ünlü oyuncu kimdir?", ["Will Smith", "Brad Pitt", "Leonardo DiCaprio", "Johnny Depp"], 0, "kolay", ["magazin", "sinema"]),
    ("Dünyaca ünlü K-Pop grubu BTS hangi ülkenin grubudur?", ["Güney Kore", "Japonya", "Çin", "Tayland"], 0, "kolay", ["muzik", "kpop"]),
    ("Harry Potter serisinin yazarı J.K. Rowling hangi ülkenin vatandaşıdır?", ["İngiltere", "ABD", "Avustralya", "Kanada"], 0, "kolay", ["edebiyat", "yazar"]),
    ("'La Casa de Papel' dizisinde soygun ekibinin taktığı maske kime aittir?", ["Salvador Dali", "Picasso", "Van Gogh", "Frida Kahlo"], 0, "kolay", ["dizi", "sanat"]),
    ("Dünyanın en çok hasılat yapan filmi (2024 itibarıyla) hangisidir?", ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars"], 0, "orta", ["sinema", "rekor"]),
    ("James Bond karakterini en son canlandıran oyuncu (2021 itibarıyla) kimdir?", ["Daniel Craig", "Pierce Brosnan", "Sean Connery", "Roger Moore"], 0, "kolay", ["sinema", "ajan"]),
    ("Spotify'da tüm zamanların en çok dinlenen şarkısı rekorunu kıran 'Blinding Lights' kime aittir?", ["The Weeknd", "Ed Sheeran", "Drake", "Justin Bieber"], 0, "orta", ["muzik", "hit"]),
    ("'Friends' dizisindeki 'Chandler Bing' karakterini canlandıran ve 2023'te hayatını kaybeden oyuncu kimdir?", ["Matthew Perry", "Matt LeBlanc", "David Schwimmer", "Paul Rudd"], 0, "kolay", ["dizi", "vefat"]),
    ("Barbie filminin yönetmeni kimdir?", ["Greta Gerwig", "Christopher Nolan", "Quentin Tarantino", "Sofia Coppola"], 0, "orta", ["sinema", "yonetmen"]),
    ("Hangi şarkıcı 'Queen of Pop' (Popun Kraliçesi) olarak anılır?", ["Madonna", "Beyonce", "Lady Gaga", "Britney Spears"], 0, "kolay", ["muzik", "pop"]),
    ("'Breaking Bad' dizisindeki Walter White'ın takma adı nedir?", ["Heisenberg", "Scarface", "Capone", "Jesse"], 0, "kolay", ["dizi", "karakter"]),
    ("Oscar ödüllü 'Parazit' filmi hangi ülkeye aittir?", ["Güney Kore", "Japonya", "Çin", "Tayvan"], 0, "kolay", ["sinema", "odul"]),
    ("Hangisi bir süper kahraman değildir?", ["Joker", "Batman", "Spider-Man", "Superman"], 0, "kolay", ["sinema", "cizgi_roman"]),
    ("2024 yılında vizyona giren 'Dune: Çöl Gezegeni Bölüm 2' filminin başrol oyuncusu kimdir?", ["Timothée Chalamet", "Tom Holland", "Austin Butler", "Zendaya"], 0, "orta", ["sinema", "gundem"]),
    ("Rap müzik sanatçısı Eminem'in gerçek adı nedir?", ["Marshall Mathers", "Curtis Jackson", "Calvin Broadus", "Shawn Carter"], 0, "orta", ["muzik", "rap"]),
    ("Hangisi 'Yüzüklerin Efendisi' üçlemesinden bir film değildir?", ["Hobbit", "Yüzük Kardeşliği", "İki Kule", "Kralın Dönüşü"], 0, "kolay", ["sinema", "fantastik"]),
    ("Dünyaca ünlü DJ David Guetta hangi ülkenin vatandaşıdır?", ["Fransa", "Hollanda", "ABD", "İsveç"], 0, "orta", ["muzik", "dj"]),
    ("'Black Mirror' dizisinin ana teması nedir?", ["Teknolojinin distopik etkileri", "Ortaçağ savaşları", "Dedektiflik hikayeleri", "Romantik komedi"], 0, "kolay", ["dizi", "teknoloji"]),
    ("Oscar ödülünü kazanan ilk siyahi kadın oyuncu kimdir?", ["Halle Berry", "Viola Davis", "Whoopi Goldberg", "Oprah Winfrey"], 0, "zor", ["sinema", "tarih"]),
    ("'Shape of You' şarkısıyla tanınan kızıl saçlı İngiliz şarkıcı kimdir?", ["Ed Sheeran", "Harry Styles", "Sam Smith", "Lewis Capaldi"], 0, "kolay", ["muzik", "pop"]),
    ("John Wick serisinin başrol oyuncusu kimdir?", ["Keanu Reeves", "Tom Cruise", "Brad Pitt", "Liam Neeson"], 0, "kolay", ["sinema", "aksiyon"]),
    ("'Winter is Coming' (Kış Geliyor) sözü hangi diziyle özdeşleşmiştir?", ["Game of Thrones", "Vikings", "The Witcher", "Stranger Things"], 0, "kolay", ["dizi", "replik"]),
    ("Rihanna'nın kurduğu kozmetik markasının adı nedir?", ["Fenty Beauty", "Rare Beauty", "Kylie Cosmetics", "Haus Labs"], 0, "orta", ["moda", "marka"]),
    ("Hangisi bir Marvel karakteri değildir?", ["Batman", "Iron Man", "Thor", "Hulk"], 0, "kolay", ["sinema", "cizgi_roman"]),
    ("Jennifer Aniston hangi diziyle dünya çapında üne kavuşmuştur?", ["Friends", "Seinfeld", "How I Met Your Mother", "The Office"], 0, "kolay", ["dizi", "oyuncu"]),
    ("Leonardo DiCaprio hangi filmle 'En İyi Erkek Oyuncu' Oscar'ını kazanmıştır?", ["The Revenant (Diriliş)", "Titanic", "Inception", "The Wolf of Wall Street"], 0, "orta", ["sinema", "odul"]),
    ("'Gangnam Style' şarkısıyla YouTube'da rekor kıran sanatçı kimdir?", ["PSY", "BTS", "Blackpink", "Rain"], 0, "kolay", ["muzik", "viral"]),
    ("Wednesday dizisi hangi kurgusal ailenin kızını anlatır?", ["Addams Ailesi", "Simpson Ailesi", "Flintstone Ailesi", "Jetgiller"], 0, "kolay", ["dizi", "karakter"]),
]

for q, a, c_idx, diff, xtra in pop_questions:
    questions.append(create_question(id_counter, q, a, c_idx, diff, xtra))
    id_counter += 1


# ==============================================================================
# MODERN LIFESTYLE & GAMING (30)
# ==============================================================================

lifestyle_questions = [
    ("Popüler FPS oyunu 'Counter-Strike: Global Offensive' (CS:GO) yerini hangi oyuna bırakmıştır?", ["Counter-Strike 2", "Valorant", "Overwatch", "Apex Legends"], 0, "kolay", ["oyun", "espor"]),
    ("Twitch platformu ne için kullanılır?", ["Canlı yayın (oyun vb.)", "İkinci el eşya satışı", "Arkadaş bulma", "Film izleme"], 0, "kolay", ["internet", "yayin"]),
    ("'Mukbang' trendi neyi ifade eder?", ["Yemek yeme yayını", "Dans videosu", "Seyahat vlogu", "Makyaj tüyosu"], 0, "orta", ["internet", "kultur"]),
    ("Dünyanın en çok kahve dükkanına sahip zinciri hangisidir?", ["Starbucks", "Dunkin'", "Tim Hortons", "Costa Coffee"], 0, "kolay", ["yasam", "marka"]),
    ("Vegan beslenme tarzında ne tüketilmez?", ["Hayvansal gıdalar (Et, süt, yumurta)", "Gluten", "Şeker", "Kafein"], 0, "kolay", ["yasam", "saglik"]),
    ("Hangisi bir 'Battle Royale' oyunu değildir?", ["FIFA", "PUBG", "Fortnite", "Call of Duty: Warzone"], 0, "kolay", ["oyun", "tur"]),
    ("IKEA hangi ülkenin markasıdır?", ["İsveç", "Danimarka", "Almanya", "Norveç"], 0, "kolay", ["marka", "ulke"]),
    ("Uzaktan çalışmayı ifade eden terim hangisidir?", ["Remote", "Hybrid", "Freelance", "Office"], 0, "kolay", ["is_hayati", "terim"]),
    ("Hangisi Z kuşağını tanımlayan yıllardır (yaklaşık)?", ["1997-2012", "1980-1996", "1965-1979", "2013-2025"], 0, "orta", ["sosyoloji", "kusak"]),
    ("Minimalizm yaşam felsefesi neyi savunur?", ["Sadelik ve az eşya", "Lüks tüketim", "Karmaşa ve kaos", "Sürekli biriktirme"], 0, "kolay", ["yasam", "felsefe"]),
    ("Hangisi bir 'süper gıda' (superfood) olarak bilinir?", ["Chia tohumu", "Beyaz ekmek", "Patates kızartması", "Gazlı içecek"], 0, "kolay", ["beslenme", "trend"]),
    ("Dünyanın en büyük e-ticaret sitesi Alibaba hangi ülkenindir?", ["Çin", "ABD", "Japonya", "Hindistan"], 0, "kolay", ["internet", "ekonomi"]),
    ("Hangisi bir 'Streaming' platformu değildir?", ["Wikipedia", "Netflix", "Spotify", "Disney+"], 0, "kolay", ["internet", "eglence"]),
    ("Podcasting ne anlama gelir?", ["Sesli içerik yayını", "Fotoğraf paylaşımı", "Kodlama dili", "E-posta servisi"], 0, "kolay", ["internet", "medya"]),
    ("Hangisi bir kahve türü değildir?", ["Guacamole", "Latte", "Espresso", "Americano"], 0, "kolay", ["yasam", "icecek"]),
    ("Dünyanın en pahalı baharatı olarak bilinen bitki hangisidir?", ["Safran", "Vanilya", "Kakule", "Tarçın"], 0, "orta", ["yasam", "gida"]),
    ("Michelin Yıldızı hangi alanda verilen prestijli bir ödüldür?", ["Restoran / Gastronomi", "Otelcilik", "Otomobil lastiği", "Mimari"], 0, "orta", ["yasam", "odul"]),
    ("Emoji kelimesi hangi dilden gelmektedir?", ["Japonca", "İngilizce", "Fransızca", "Korece"], 0, "orta", ["internet", "dil"]),
    ("Selfie (Özçekim) kelimesi hangi yıl Oxford Sözlüğü tarafından yılın kelimesi seçilmiştir?", ["2013", "2010", "2015", "2008"], 0, "zor", ["internet", "kultur"]),
    ("Hangisi bir 'Akıllı Ev' (Smart Home) ürünü olabilir?", ["Robot süpürge", "Tüplü televizyon", "Çevirmeli telefon", "Daktilo"], 0, "kolay", ["teknoloji", "ev"]),
    ("Yoga ve meditasyon hangi kültürden dünyaya yayılmıştır?", ["Hint", "Çin", "Japon", "Mısır"], 0, "kolay", ["yasam", "kultur"]),
    ("Glutensiz beslenme kime yöneliktir?", ["Çölyak hastalarına", "Diyabetlilere", "Kalp hastalarına", "Hiçbiri"], 0, "orta", ["saglik", "beslenme"]),
    ("e-Devlet kapısına giriş yapmak için kullanılan şifreyi nereden alabilirsiniz?", ["PTT", "Nüfus Müdürlüğü", "Belediye", "Muhtarlık"], 0, "kolay", ["turkiye", "yasam"]),
    ("Zoom uygulaması özellikle hangi dönemde popülerleşmiştir?", ["Pandemi", "2000'ler", "Soğuk Savaş", "Endüstri Devrimi"], 0, "kolay", ["internet", "gundem"]),
    ("Dünyanın en çok oynanan kutu oyunu (board game) hangisidir?", ["Monopoly", "Satranç", "Tavla", "Scrabble"], 0, "orta", ["oyun", "hobi"]),
    ("QR Kod (Karekod) ne işe yarar?", ["Hızlı bilgiye erişim", "Sadece ödeme yapma", "Fotoğraf çekme", "Müzik çalma"], 0, "kolay", ["teknoloji", "arac"]),
    ("Influencer kime denir?", ["Sosyal medyada etkileyici kişi", "Yazılım mühendisi", "Haber spikeri", "Doktor"], 0, "kolay", ["internet", "terim"]),
    ("Hangisi bir 'mem' (meme) karakteri değildir?", ["Super Mario", "Doge", "Pepe the Frog", "Grumpy Cat"], 0, "orta", ["internet", "mizah"]),
    ("ASMR videolarının amacı nedir?", ["Rahatlama ve uyku", "Korkutma", "Eğitici bilgi", "Spor motivasyonu"], 0, "orta", ["internet", "trend"]),
    ("K-Drama hangi ülkenin dizilerine verilen addır?", ["Güney Kore", "Kuzey Kore", "Japonya", "Çin"], 0, "kolay", ["dizi", "kultur"]),
]

for q, a, c_idx, diff, xtra in lifestyle_questions:
    questions.append(create_question(id_counter, q, a, c_idx, diff, xtra))
    id_counter += 1

# ==============================================================================
# SCIENCE, FUTURE & MISC (30)
# ==============================================================================

future_questions = [
    ("CRISPR teknolojisi hangi alanda devrim yaratmıştır?", ["Gen düzenleme", "Uzay yolculuğu", "Kuantum bilgisayar", "Nükleer enerji"], 0, "zor", ["bilim", "genetik"]),
    ("Yapay zekanın insan zekasını geçeceği varsayılan noktaya ne ad verilir?", ["Teknolojik Tekillik (Singularity)", "Büyük Patlama", "Kıyamet", "Evrim"], 0, "zor", ["bilim", "felsefe"]),
    ("James Webb Uzay Teleskobu neyin yerini alması için fırlatılmıştır?", ["Hubble", "Kepler", "Voyager", "Sputnik"], 0, "orta", ["uzay", "bilim"]),
    ("Nörolink projesi neyi amaçlamaktadır?", ["Beyin-bilgisayar arayüzü", "Ölümsüzlük", "Işınlanma", "Zaman yolculuğu"], 0, "orta", ["teknoloji", "saglik"]),
    ("Hangisi yenilenebilir enerji kaynağıdır?", ["Güneş", "Kömür", "Doğalgaz", "Petrol"], 0, "kolay", ["cevre", "enerji"]),
    ("CERN'deki Büyük Hadron Çarpıştırıcısı hangi ülkededir (sınırında)?", ["İsviçre / Fransa", "ABD / Kanada", "Almanya / Polonya", "Rusya / Çin"], 0, "orta", ["bilim", "mekan"]),
    ("Higgs Bozonu'nun halk arasındaki popüler adı nedir?", ["Tanrı Parçacığı", "Hayalet Parçacık", "Süper Parçacık", "Karanlık Madde"], 0, "orta", ["bilim", "fizik"]),
    ("Grafen maddesinin en önemli özelliği nedir?", ["Çok ince ve dayanıklı olması", "Suda çözünmesi", "Radyoaktif olması", "Ağır olması"], 0, "zor", ["bilim", "malzeme"]),
    ("Otonom araç ne demektir?", ["Sürücüsüz giden araç", "Uçan araba", "Elektrikli araba", "Hızlı araba"], 0, "kolay", ["teknoloji", "gelecek"]),
    ("3D Yazıcı ile aşağıdakilerden hangisi üretilebilir?", ["Hepsi", "Yiyecek", "Ev", "Organ dokusu"], 0, "orta", ["teknoloji", "uretim"]),
    ("Blokzincir (Blockchain) teknolojisinin temel özelliği nedir?", ["Merkeziyetsiz ve değiştirilemez kayıt", "Gizli mesajlaşma", "Hızlı internet", "Yapay zeka"], 0, "orta", ["teknoloji", "kripto"]),
    ("Sanal gerçeklik ile Artırılmış gerçeklik arasındaki fark nedir?", ["VR tamamen sanal, AR gerçek üzerine ekleme", "Fark yoktur", "AR daha pahalıdır", "VR sadece oyun içindir"], 0, "orta", ["teknoloji", "vr"]),
    ("İnsanlık tarihinde Ay'a en son hangi yıl ayak basılmıştır (Apollo 17)?", ["1972", "1969", "1980", "2000"], 0, "zor", ["uzay", "tarih"]),
    ("Uluslararası Uzay İstasyonu'nda (ISS) sürekli olarak ne yapılır?", ["Bilimsel deneyler", "Savaş hazırlığı", "Hapis cezası", "Turistik parti"], 0, "kolay", ["uzay", "bilim"]),
    ("Hangisi küresel ısınmanın sonuçlarından biridir?", ["Buzulların erimesi", "Daha çok kar yağması", "Volkanik patlamalar", "Depremler"], 0, "kolay", ["cevre", "iklim"]),
    ("Karbon ayak izi neyi ifade eder?", ["Doğaya salınan sera gazı miktarı", "Ayakkabı numarası", "Orman yangını", "Kömür madeni"], 0, "kolay", ["cevre", "terim"]),
    ("Turing Testi neyi ölçmek için tasarlanmıştır?", ["Makinenin insan gibi düşünüp düşünemediğini", "Bilgisayarın hızını", "İnternet bağlantısını", "Ekran çözünürlüğünü"], 0, "orta", ["ai", "bilim"]),
    ("Deepfake teknolojisi ne yapar?", ["Yüz ve ses değiştirme / sahtecilik", "Derin deniz araştırması", "Yeraltı madenciliği", "Uzay gözlemi"], 0, "kolay", ["ai", "teknoloji"]),
    ("5G teknolojisinin 4G'den en büyük farkı nedir?", ["Daha yüksek hız ve düşük gecikme", "Daha ucuz olması", "Daha az radyasyon", "Sadece telefonlarda çalışması"], 0, "kolay", ["teknoloji", "iletisim"]),
    ("Nesnelerin İnterneti (IoT) ne demektir?", ["Cihazların birbirleriyle haberleşmesi", "Hızlı internet", "Sanal alışveriş", "Sosyal medya"], 0, "kolay", ["teknoloji", "terim"]),
    ("Boston Dynamics şirketi ne üretmektedir?", ["Gelişmiş robotlar", "Bilgisayar oyunu", "Cep telefonu", "Spor ayakkabı"], 0, "orta", ["teknoloji", "robot"]),
    ("Sophia adlı robotun en ilginç özelliği nedir?", ["Vatandaşlık alan ilk robot olması (Suudi Arabistan)", "Uçabilmesi", "Yemek yapabilmesi", "Su altında çalışması"], 0, "orta", ["robot", "gundem"]),
    ("Big Data (Büyük Veri) ne anlama gelir?", ["Devasa boyuttaki veri setlerinin analizi", "Büyük hard disk", "Uzun e-postalar", "Ansiklopedi"], 0, "kolay", ["teknoloji", "veri"]),
    ("Kuantum bilgisayarların klasik bilgisayarlardan farkı nedir?", ["Qubit kullanması ve çok daha hızlı işlem", "Daha küçük olması", "Daha ucuz olması", "Pilsiz çalışması"], 0, "zor", ["bilim", "bilgisayar"]),
    ("Dark Web (Karanlık Ağ) ne demektir?", ["İnternetin gizli ve şifreli katmanı", "Gece modu", "Elektrik kesintisi", "Kötü web siteleri"], 0, "orta", ["internet", "guvenlik"]),
    ("Siber güvenlikte 'Phishing' (Oltalama) nedir?", ["Sahte e-posta/site ile bilgi çalma", "Balık tutma oyunu", "Virüs taraması", "Şifre oluşturma"], 0, "kolay", ["guvenlik", "internet"]),
    ("Hangisi bir bulut depolama (Cloud) hizmetidir?", ["Google Drive", "WinRAR", "Paint", "Notepad"], 0, "kolay", ["internet", "yazilim"]),
    ("VPN ne işe yarar?", ["İnternet trafiğini şifreleyip gizleme", "Bilgisayarı hızlandırma", "Virüs temizleme", "Oyun indirme"], 0, "kolay", ["internet", "arac"]),
    ("Giyilebilir teknoloji ürününe örnek hangisidir?", ["Akıllı saat", "Masaüstü bilgisayar", "Tablet", "Yazıcı"], 0, "kolay", ["teknoloji", "urun"]),
    ("Türkiye'nin insansız hava aracı (İHA/SİHA) markası hangisidir?", ["Bayraktar", "Altay", "Atak", "Hürkuş"], 0, "kolay", ["savunma", "teknoloji"]),
]


for q, a, c_idx, diff, xtra in future_questions:
    questions.append(create_question(id_counter, q, a, c_idx, diff, xtra))
    id_counter += 1

# Output logic
with open('src/data/seeds/batch_078_tr_modern_world.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Generated {len(questions)} modern GK questions in batch_078_tr_modern_world.json")

