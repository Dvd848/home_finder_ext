//http://stackoverflow.com/questions/295566/
const tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

const tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');

function removeTags(html) {
    let oldHtml;
    do {
        oldHtml = html;
        html = html.replace(tagOrComment, '');
    } while (html !== oldHtml);
    return html.replace(/</g, '&lt;');
}

function escapeRegExp(s, i) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};

function buildListRegexFromArray(arr) {
    let res = "";
    res = arr.map(escapeRegExp);
    res = res.join("|");
    return res;
};

const ZERO_WIDTH_SPACE = String.fromCharCode(8203);

const word_boundry = "(?=[\\+\\b\\.!?,\\*\\s\\-\\)\\(/\\-:'}\\\"\\\\" + ZERO_WIDTH_SPACE + "]|$)"; //end

//const streetNameRegex = new RegExp("((?:(?:[\\s\\(\\)\\-:/{\\\",\\.]+|^)ב?מ?ל?ו?)("+buildListRegexFromArray(streetArr)+")(\\s*(?:[1-9][0-9]*)?))" + word_boundry,"g");

//const neighborhoodRegex = new RegExp("(^|[^א-ת](?:ש?ב?ה?מ?ל?ו?)?)" + "(" + buildListRegexFromArray(neighborhoodArr) + ")" + word_boundry,"ig");

const phraseRegex = new RegExp(/(הרכבת הקלה|מתחם הרכבת|בתקופה זו|תקופה של|תחנת הרכבת|טיילת הרכבת|כל התקופה|בן אדם|לא עובד|שימו לב|לאדם|לתקופה|לרכבת|רמי לוי|מוצפת|ברמה|מפרץ חיפה|ברות|משותפת|מראה את|להמליץ|עובד ב|[^ה]מדרגות)/g);

//Phrases that contain one of the words that are also part of a street name and also a special word below
const phraseRegex2 = new RegExp("(כ\"ט בנובמבר)", "g");

const subletRegex = new RegExp(/(מסאבלטת|מסאבלט|מסבלטת|מסבלט|סבלט|סאבלט|סאלבט)/g);

const roommateRegex = new RegExp(/(שותפ\/ה|שותף\/ה|שותף|שותפה|שותפים|שותפות|שותפ)/g);

const coupleRegex = new RegExp("([^א-ת]|ל|ו|ול|^)(זוגות|זוג)" + word_boundry, "g");

const monthRegex = new RegExp("([\\s\\-]+" 
/*alignToLeft*/            + "(?:ב|מ|ל|ו)?" 
/*alignToLeft*/         + "(?:ינואר|פברואר|מרץ|מרס|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר|מיידי|מיידית|מידית|הכניסה|כניסה)" 
                + word_boundry + ")", "g");

const rentRegex = new RegExp(/((?:[1-9][\d,]*[\d])?(?:\s*-\s*[1-9][\d,]*[\d])?\s*(שכר דירה|שכר הדירה|ש&quot;ח|ש"ח|שקל|ש״ח|שח|ש''ח|ש'ח|שכה"ד|שכ"ד|שכ״ד|שכה״ד|שכד|כולל ה-כ-ל|שקלים|לחודש|כולל הכלל|לא כולל|כולל הכל|הסכום הוא|מחיר)(?:[^א-ת]|$)\s*(?:[1-9][\d,]*[\d])?)/g);
const rentRegex2 = new RegExp(/((?:[1-9][\d,]*[\d])?[ ]*(₪)\s*(?:[1-9][\d,]*[\d])?)/g);

const streetRegex = new RegExp(/(מדרחוב|רחוב(?!ות)|רח')/g);


const stuffRegex = new RegExp("(^|[^א-ת](?:ב?ה?מ?ל?ו?)?)" + 
        "(מיקרוגל|מזרן|מיטה|מכונת כביסה|פינת אוכל|בסיס|קומקום|מגירות|מגירה|מדף|מראה|שידה|שואב אבק|DVD|דיוידי|כורסא|כורסה|כורסאות|מדפים|שידות|מזרון|ספה|ספות|כסאות|כיסאות|כסא|כיסא|מקרר|תנור|כיריים|טוסטר אובן|מייבש|מדיח|מזגן|מאוורר|מסך|טלויזיה|טלוויזיה|שולחנות|שולחן|כורסאות|ארונות|ארון בגדים|ארון|מיטות|ספריה|אופניים|מדפסת|שולחן אוכל|שולחן כתיבה|שידת|מיקרו|מיטת יחיד|מיטה זוגית|ארגז מצעים|שטיח|שטיחים|כורסת|ארונית|רדיאטור|ספרייה|הליכון|טלויזיות|שששששש)"+word_boundry, "g");

const religionRegex = new RegExp("(^|[^א-ת](?:ל|ה|ול|ו)?)(דתיה|דתייה|דתי|כשרות|דתית|כשר|שבת|דתיים|דתיות)" + word_boundry, "g");

const cityDataCache = {}

function prepareCityDataParsed(cityData) {
    if (!(cityData.id in cityDataCache)) {
        cityDataCache[cityData.id] = {
            streetNameRegex: new RegExp("((?:(?:[\\s\\(\\)\\-:/{\\\",\\.]+|^)ב?מ?ל?ו?)("+buildListRegexFromArray(cityData.streetArr)+")(\\s*(?:[1-9][0-9]*)?))" + word_boundry,"g"),
            neighborhoodRegex: new RegExp("(^|[^א-ת](?:ש?ב?ה?מ?ל?ו?)?)" + "(" + buildListRegexFromArray(cityData.neighborhoodArr) + ")" + word_boundry,"ig"),
            cityName: cityData.cityName,
            cityName_en: cityData.cityName_en
        }
    }
    return cityDataCache[cityData.id];
}



function replaceKeywords(cityDataParsed, text) {
    
    text = text.replace(/(״)/g, "\"");
    
    text = text.replace(/(׳)/g, "'");

    //Phrases to skip - will be stripped later on
    //Must be first
    text = text.replace(phraseRegex, ZERO_WIDTH_SPACE + "<span class='skip'>$1</span>" + ZERO_WIDTH_SPACE);
    
    //must be second
    text = text.replace(phraseRegex2, ZERO_WIDTH_SPACE + "<span class='skipBeforeStreets'>$1</span>" + ZERO_WIDTH_SPACE);

    text = text.replace(subletRegex, ZERO_WIDTH_SPACE + "<b style='color: Tomato'>$1</b>" + ZERO_WIDTH_SPACE); 

    text = text.replace(roommateRegex, ZERO_WIDTH_SPACE + "<b style='color: red'>$1</b>" + ZERO_WIDTH_SPACE);
    
    text = text.replace(coupleRegex, ZERO_WIDTH_SPACE + "$1<b style='color: Magenta'>$2</b>" + ZERO_WIDTH_SPACE); 
    
    text = text.replace(monthRegex, ZERO_WIDTH_SPACE + "<b style='color: blue'>$1</b>" + ZERO_WIDTH_SPACE); 
    
    text = text.replace(rentRegex2, ZERO_WIDTH_SPACE + "<b style='color: green'>$1</b>" + ZERO_WIDTH_SPACE); //must come before rentRegex 
    text = text.replace(rentRegex, ZERO_WIDTH_SPACE + "<b style='color: green'>$1</b>" + ZERO_WIDTH_SPACE); 

    text = text.replace(cityDataParsed.neighborhoodRegex, ZERO_WIDTH_SPACE + "$1<b style='color: purple'>$2</b>" + ZERO_WIDTH_SPACE);
    
    text = text.replace(streetRegex, ZERO_WIDTH_SPACE + "<b style='color: BurlyWood'>$1</b>" + ZERO_WIDTH_SPACE);
    
    text = text.replace(stuffRegex, ZERO_WIDTH_SPACE + "$1<b style='color: DodgerBlue'>$2</b>" + ZERO_WIDTH_SPACE);
    
    text = text.replace(religionRegex, ZERO_WIDTH_SPACE + "$1<b style='color: Olive'>$2</b>" + ZERO_WIDTH_SPACE);
    
    //must come before streets
    text =  text.replace(/<span class='skipBeforeStreets'>.*?<\/span>/g, function(match, p1) {
        return removeTags(match);
    });
    
    //must be before last
    text = text.replace(cityDataParsed.streetNameRegex, function(match, p1, p2, p3) {
            
            let pre_linebreak = "";
            let post_linebreak = "";
            
            if (/\d+/.test(p3))
            {
                //if p3 is numeric
                const p3Num = parseInt(p3);
                if (p3Num > 1000)
                {
                    //probably not a street address
                    return match;
                }
            }
            
            /*
            console.log("start")
            console.log("p1", p1)
            console.log("p2", p2)
            console.log("p3", p3)
            console.log("end")
            */
            
            let a = p1;
            if (a.indexOf("\n") == 0)
            {
                pre_linebreak = "\n";
            }
            if (new RegExp(/\n\s*$/).test(a)) {
                    post_linebreak = "\n";
            }
            
            a = a.replace(/\n/g, "");
            
            const firstLetter = a.search(/[א-ת]/);
            pre_linebreak += a.substring(0, firstLetter);
            a = a.substring(firstLetter, a.length);
            
            let b = ""+p2+p3;
            b = b.replace(/('|׳)/g, '&apos;').replace(/\n/g, "");

            let maps_link = "https://www.google.com/local";
                        
            return ""+pre_linebreak+"<b style='color: orange'><a style='color: orange; text-decoration: underline;' href='" 
            + maps_link + "?f=q&source=s_q&language=iw&hl=iw&ie=UTF8&geocode=&q=רחוב+" 
            + b + ",+" + cityDataParsed.cityName + "+" + cityDataParsed.cityName_en + "' target='_BLANK'>" 
            + a + "</a></b>"  + post_linebreak;
    });


    //Strip the phrases we don't want to color
    //Must be last
    text =  text.replace(/<span class='skip'>.*?<\/span>/g, function(match, p1) {
        return removeTags(match);
    });

    return text;
};

const cityData = {};