// Initialize Supabase client (only if config is available)
let supabase = null;

function initializeSupabase() {
    // Check for Supabase library - when loaded from CDN, it should be window.supabase
    if (!window.SUPABASE_CONFIG) {
        console.error('❌ SUPABASE_CONFIG not found! Check config.js');
        console.log('Config should be at:', window.SUPABASE_CONFIG);
        return false;
    }
    
    console.log('Checking for Supabase library...');
    console.log('window.supabase:', window.supabase);
    console.log('window.Supabase:', window.Supabase);
    
    // Try different ways the library might be exposed
    let supabaseLib = null;
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabaseLib = window.supabase;
        console.log('Found Supabase at window.supabase');
    } else if (window.Supabase && typeof window.Supabase.createClient === 'function') {
        supabaseLib = window.Supabase;
        console.log('Found Supabase at window.Supabase');
    } else {
        console.error('❌ window.supabase not found! Check if Supabase script is loaded');
        console.log('Available window properties:', Object.keys(window).filter(k => k.toLowerCase().includes('supa')));
        console.log('Try calling window.testSupabaseDirect() in console');
        return false;
    }
    
    try {
        supabase = supabaseLib.createClient(
            window.SUPABASE_CONFIG.url, 
            window.SUPABASE_CONFIG.anonKey
        );
        console.log('✅ Supabase client initialized successfully');
        console.log('Supabase URL:', window.SUPABASE_CONFIG.url);
        
        // Test the connection immediately
        testSupabaseConnection();
        
        return true;
    } catch (e) {
        console.error('❌ Supabase initialization error:', e);
        console.error('Error stack:', e.stack);
        return false;
    }
}

// Test Supabase connection
async function testSupabaseConnection() {
    if (!supabase) {
        console.error('Cannot test - Supabase client not initialized');
        return;
    }
    
    try {
        console.log('Testing Supabase connection...');
        const { data, error, count } = await supabase
            .from('articles')
            .select('*', { count: 'exact' });
        
        if (error) {
            console.error('❌ Supabase connection test FAILED:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
        } else {
            console.log(`✅ Supabase connection test PASSED`);
            console.log(`Found ${data ? data.length : 0} articles in database`);
            if (data && data.length > 0) {
                console.log('Sample article:', data[0]);
            }
        }
    } catch (e) {
        console.error('Exception during Supabase test:', e);
    }
}

// Wait for scripts to load, then initialize
function waitForSupabase(maxAttempts = 20) {
    let attempts = 0;
    const checkInterval = setInterval(() => {
        attempts++;
        if (window.SUPABASE_CONFIG && window.supabase) {
            clearInterval(checkInterval);
            initializeSupabase();
        } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            console.error('❌ Supabase library not found after waiting');
            console.error('SUPABASE_CONFIG available:', !!window.SUPABASE_CONFIG);
            console.error('window.supabase available:', !!window.supabase);
            if (window.SUPABASE_CONFIG) {
                console.error('Config URL:', window.SUPABASE_CONFIG.url);
            }
        }
    }, 100);
}

// Try to initialize immediately
if (window.SUPABASE_CONFIG && window.supabase) {
    initializeSupabase();
} else {
    // Wait for scripts to load
    waitForSupabase();
}

// Admin password (in production, this should be stored securely)
const ADMIN_PASSWORD = 'alli2025'; // Change this to your desired password

// Check if admin is authenticated (stored in sessionStorage)
function isAdminAuthenticated() {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
}

// Set admin authentication
function setAdminAuthenticated(value) {
    sessionStorage.setItem('adminAuthenticated', value ? 'true' : 'false');
}

// Placeholder articles data
const placeholderArticles = [
    {
        id: '1',
        title: 'Understanding Macronutrients: A Complete Guide',
        description: 'Learn about proteins, carbs, and fats and how they fuel your body for optimal health.',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
        content: `# Understanding Macronutrients: A Complete Guide

Macronutrients are the three main components of our diet that provide energy: carbohydrates, proteins, and fats. Understanding how to balance these nutrients is crucial for optimal health and performance.

## Carbohydrates

Carbohydrates are your body's primary source of energy. They're broken down into glucose, which fuels your brain, muscles, and organs. There are two types:

- **Simple carbs**: Found in fruits, honey, and processed foods. They provide quick energy.
- **Complex carbs**: Found in whole grains, vegetables, and legumes. They provide sustained energy.

## Proteins

Proteins are essential for building and repairing tissues, making enzymes and hormones, and supporting immune function. Good sources include:

- Lean meats and poultry
- Fish and seafood
- Eggs and dairy
- Legumes and beans
- Nuts and seeds

## Fats

Healthy fats are crucial for brain function, hormone production, and nutrient absorption. Focus on:

- Avocados
- Nuts and seeds
- Olive oil
- Fatty fish (salmon, mackerel)
- Dark chocolate

## Balancing Your Macros

A balanced diet typically includes:
- 45-65% carbohydrates
- 10-35% protein
- 20-35% fat

Remember, individual needs vary based on activity level, goals, and health conditions.`,
        author: 'Alli Nutrition Team',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Meal Planning Made Simple',
        description: 'Discover practical strategies for planning nutritious meals that fit your busy lifestyle.',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        content: `# Meal Planning Made Simple

Meal planning doesn't have to be complicated. With a few simple strategies, you can save time, reduce stress, and eat healthier.

## Benefits of Meal Planning

- Saves time and money
- Reduces food waste
- Ensures balanced nutrition
- Reduces decision fatigue
- Helps you stick to your goals

## Getting Started

### 1. Choose Your Planning Method

- **Weekly planning**: Plan all meals for the week ahead
- **Batch cooking**: Prepare large batches of staples
- **Theme nights**: Designate certain days for specific cuisines

### 2. Build Your Meal Framework

Start with:
- Protein source
- Complex carbohydrate
- Vegetables (aim for 2-3 types)
- Healthy fat

### 3. Prep in Advance

- Wash and chop vegetables
- Cook grains and proteins
- Portion snacks
- Prepare dressings and sauces

## Sample Meal Plan

**Breakfast**: Greek yogurt with berries and granola
**Lunch**: Quinoa salad with chickpeas and roasted vegetables
**Dinner**: Grilled salmon with sweet potato and broccoli
**Snacks**: Apple with almond butter, mixed nuts

## Tips for Success

1. Start small - plan just a few days at first
2. Keep it flexible - have backup options
3. Use leftovers creatively
4. Invest in good storage containers
5. Make it a weekly habit

Remember, meal planning is a tool to make your life easier, not add stress. Find what works for you!`,
        author: 'Alli Nutrition Team',
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        title: 'Hydration: The Foundation of Health',
        description: 'Explore why proper hydration is essential and how to ensure you\'re drinking enough water daily.',
        image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800',
        content: `# Hydration: The Foundation of Health

Water is essential for life, yet many people don't drink enough. Proper hydration affects everything from energy levels to cognitive function.

## Why Hydration Matters

Water makes up about 60% of your body weight and is involved in:

- Regulating body temperature
- Transporting nutrients
- Removing waste
- Lubricating joints
- Supporting brain function
- Maintaining healthy skin

## Signs of Dehydration

Watch for these symptoms:
- Thirst
- Dark yellow urine
- Fatigue
- Headaches
- Dizziness
- Dry skin

## How Much Water Do You Need?

The general recommendation is:
- **Men**: About 3.7 liters (125 ounces) per day
- **Women**: About 2.7 liters (91 ounces) per day

But individual needs vary based on:
- Activity level
- Climate
- Overall health
- Pregnancy/breastfeeding

## Tips for Staying Hydrated

1. **Start your day** with a glass of water
2. **Keep a water bottle** with you at all times
3. **Set reminders** on your phone
4. **Eat water-rich foods** like fruits and vegetables
5. **Drink before you're thirsty**
6. **Flavor your water** with lemon, cucumber, or berries

## Hydration Beyond Water

While water is best, other fluids count too:
- Herbal teas
- Sparkling water
- Fruits and vegetables (cucumber, watermelon, oranges)
- Broth-based soups

## Special Considerations

**During exercise**: Drink 17-20 ounces 2-3 hours before, and 7-10 ounces every 10-20 minutes during
**In hot weather**: Increase intake by 1-2 glasses
**When ill**: Extra fluids help with recovery

Remember, your body is constantly losing water through breathing, sweating, and digestion. Make hydration a priority!`,
        author: 'Alli Nutrition Team',
        createdAt: new Date().toISOString()
    },
    {
        id: '4',
        title: 'Building Healthy Habits That Last',
        description: 'Learn evidence-based strategies for creating sustainable nutrition habits that stick.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        content: `# Building Healthy Habits That Last

Creating lasting change isn't about willpower—it's about building systems and habits that support your goals.

## The Science of Habits

Habits consist of three parts:
1. **Cue**: The trigger that starts the habit
2. **Routine**: The behavior itself
3. **Reward**: The benefit you get from the behavior

## Start Small

The key to sustainable change is starting with tiny, manageable steps:

- Instead of "eat perfectly," start with "add one vegetable to lunch"
- Instead of "never eat sugar," start with "drink water instead of soda"
- Instead of "exercise daily," start with "10-minute walk after dinner"

## Stack Your Habits

Link new habits to existing ones:

**After I [existing habit], I will [new habit]**

Examples:
- After I brush my teeth, I will drink a glass of water
- After I finish dinner, I will prepare tomorrow's lunch
- After I wake up, I will eat a protein-rich breakfast

## Make It Obvious

- Keep healthy foods visible and accessible
- Remove tempting foods from sight
- Set reminders on your phone
- Use visual cues (like a water bottle on your desk)

## Make It Attractive

- Pair healthy habits with things you enjoy
- Join a community with similar goals
- Create a reward system
- Track your progress visually

## Make It Easy

- Reduce friction for good habits
- Increase friction for bad habits
- Prepare in advance
- Use the "2-minute rule" (start with just 2 minutes)

## Make It Satisfying

- Celebrate small wins
- Track your progress
- Share your success with others
- Focus on how you feel, not just numbers

## Common Pitfalls to Avoid

1. **All-or-nothing thinking**: Progress, not perfection
2. **Trying to change too much at once**: Focus on one habit at a time
3. **Not planning for obstacles**: Have backup plans
4. **Comparing yourself to others**: Your journey is unique

## Building Your Habit System

1. **Identify your goal**: What do you want to achieve?
2. **Choose your first habit**: What's the smallest step?
3. **Set up your environment**: Make it easy and obvious
4. **Start**: Begin today, not Monday
5. **Track**: Record your progress
6. **Adjust**: Refine as you learn what works

Remember, building habits is a marathon, not a sprint. Be patient with yourself and celebrate every step forward!`,
        author: 'Alli Nutrition Team',
        createdAt: new Date().toISOString()
    },
    {
        id: '5',
        title: 'Understanding Food Labels',
        description: 'Navigate nutrition labels with confidence and make informed food choices.',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
        content: `# Understanding Food Labels

Reading food labels can be confusing, but it's an essential skill for making informed nutrition choices.

## Key Components of a Nutrition Label

### Serving Size
This is the first thing to check. All other information on the label is based on this amount. Compare it to how much you actually eat.

### Calories
Shows the total energy in one serving. For weight management, this is important, but don't focus on it exclusively.

### Macronutrients

**Total Fat**: Includes all types of fat
- **Saturated Fat**: Limit to less than 10% of daily calories
- **Trans Fat**: Avoid when possible (look for "partially hydrogenated oils")

**Cholesterol**: Generally, aim for less than 300mg per day

**Sodium**: Most people need less than 2,300mg per day (1,500mg if you have high blood pressure)

**Total Carbohydrates**: Includes fiber, sugars, and other carbs
- **Dietary Fiber**: Aim for 25-30g per day
- **Total Sugars**: Includes natural and added sugars
- **Added Sugars**: Limit to less than 10% of daily calories

**Protein**: Essential for muscle maintenance and satiety

### Vitamins and Minerals
The label shows key nutrients. Aim to get 100% of your daily value for most vitamins and minerals.

## Ingredients List

Ingredients are listed in descending order by weight. Key things to watch for:

- **Sugar aliases**: High fructose corn syrup, cane sugar, honey, maple syrup, agave
- **Artificial additives**: Preservatives, colors, flavors
- **Allergens**: Clearly marked if present

## Common Label Tricks

1. **"Natural"**: Not a regulated term—doesn't mean healthy
2. **"Low-fat"**: Often high in sugar to compensate for taste
3. **"Sugar-free"**: May contain artificial sweeteners
4. **Serving sizes**: Often smaller than what people actually eat
5. **"Made with whole grains"**: Might still be mostly refined

## How to Use Labels Effectively

1. **Check the serving size first**
2. **Look at the ingredients list** (shorter is usually better)
3. **Focus on fiber and protein** for satiety
4. **Limit added sugars** and sodium
5. **Compare similar products** to make better choices
6. **Don't obsess over calories**—quality matters too

## Quick Reference

**Good signs**:
- High fiber (>3g per serving)
- High protein (>10g per serving)
- Low added sugars (<5g per serving)
- Short, recognizable ingredients list

**Red flags**:
- High sodium (>400mg per serving)
- High added sugars (>10g per serving)
- Trans fats (any amount)
- Long list of unrecognizable ingredients

Remember, the best foods often don't have labels at all—think fresh fruits, vegetables, and whole foods!`,
        author: 'Alli Nutrition Team',
        createdAt: new Date().toISOString()
    },
    {
        id: '6',
        title: 'Pre and Post-Workout Nutrition',
        description: 'Optimize your fitness results with the right foods before and after exercise.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        content: `# Pre and Post-Workout Nutrition

What you eat before and after exercise can significantly impact your performance, recovery, and results.

## Pre-Workout Nutrition

### Timing
- **Large meal**: 3-4 hours before exercise
- **Small meal**: 2-3 hours before
- **Snack**: 30-60 minutes before

### What to Eat

**Goal**: Provide energy without causing digestive discomfort

**Best options**:
- **30-60 minutes before**: Simple carbs (banana, dates, energy bar)
- **2-3 hours before**: Balanced meal with carbs and protein (oatmeal with fruit, chicken and rice)
- **3-4 hours before**: Full meal (same as your regular meals)

**Avoid**:
- High-fat foods (slow digestion)
- High-fiber foods (can cause bloating)
- Large amounts of protein (hard to digest quickly)
- Spicy foods (can cause discomfort)

### Hydration
- Drink 17-20 ounces 2-3 hours before
- Drink 8-10 ounces 10-20 minutes before
- Consider electrolytes if exercising intensely or in heat

## During Workout

**For workouts under 60 minutes**: Usually no food needed, just water

**For workouts over 60 minutes**: 
- 30-60g carbs per hour
- Sports drinks, energy gels, or bananas
- Small amounts of water every 15-20 minutes

## Post-Workout Nutrition

### The "Anabolic Window"

While not as critical as once thought, eating within 2 hours after exercise can help with recovery.

### What Your Body Needs

**Protein** (20-30g): 
- Repairs muscle tissue
- Supports muscle growth
- Sources: chicken, fish, eggs, Greek yogurt, protein powder

**Carbohydrates** (30-60g):
- Replenishes glycogen stores
- Helps with recovery
- Sources: sweet potatoes, rice, quinoa, fruits

**Fluids**:
- Rehydrate with water or electrolyte drinks
- Aim for 1.5x the fluid you lost

### Sample Post-Workout Meals

**Quick options**:
- Greek yogurt with berries
- Protein shake with banana
- Chicken and rice
- Egg scramble with toast

**Full meal** (within 2 hours):
- Grilled salmon with sweet potato and vegetables
- Lean beef with quinoa and roasted vegetables
- Chicken stir-fry with brown rice

## Special Considerations

### Morning Workouts
- If you can't eat before: Small snack or just water
- After: Full breakfast with protein and carbs

### Evening Workouts
- Have a balanced lunch 3-4 hours before
- Post-workout: Light dinner or snack

### Weight Loss Goals
- Focus on protein intake
- Don't "eat back" all calories burned
- Still prioritize recovery nutrition

### Muscle Gain Goals
- Higher carb intake post-workout
- Eat within the anabolic window
- Ensure adequate total daily calories

## Common Mistakes

1. **Skipping pre-workout fuel**: Can lead to poor performance
2. **Overeating post-workout**: Not necessary to eat everything
3. **Ignoring hydration**: Critical for performance and recovery
4. **Too much protein**: More isn't always better
5. **Not planning**: Leads to poor food choices

Remember, individual needs vary. Experiment to find what works best for your body and goals!`,
        author: 'Alli Nutrition Team',
        createdAt: new Date().toISOString()
    }
];

// Initialize articles - check Supabase first, then localStorage
async function initializeArticles() {
    // Try Supabase first
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (!error && data && data.length > 0) {
                // Convert and save to localStorage as backup
                const convertedArticles = data.map(article => ({
                    id: article.id.toString(),
                    title: article.title,
                    description: article.description,
                    image: article.image_url,
                    content: article.content,
                    author: article.author,
                    createdAt: article.created_at
                }));
                localStorage.setItem('articles', JSON.stringify(convertedArticles));
                return convertedArticles;
            }
            
            // If Supabase is empty, seed with placeholders
            if (!error && (!data || data.length === 0)) {
                console.log('Supabase articles table is empty, seeding placeholder articles...');
                await seedPlaceholderArticles();
                // After seeding, fetch again to get the actual articles from database
                const { data: newData, error: newError } = await supabase
                    .from('articles')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (!newError && newData && newData.length > 0) {
                    const convertedArticles = newData.map(article => ({
                        id: article.id.toString(),
                        title: article.title,
                        description: article.description,
                        image: article.image_url,
                        content: article.content,
                        author: article.author,
                        createdAt: article.created_at
                    }));
                    localStorage.setItem('articles', JSON.stringify(convertedArticles));
                    return convertedArticles;
                }
                return placeholderArticles;
            }
        } catch (e) {
            console.error('Error initializing from Supabase:', e);
            // Fallback to localStorage
        }
    }
    
    // Fallback to localStorage
    try {
        const existingArticles = localStorage.getItem('articles');
        let articles = [];
        
        if (existingArticles) {
            try {
                articles = JSON.parse(existingArticles);
            } catch (e) {
                articles = [];
            }
        }
        
        // ONLY initialize placeholders if there are ZERO articles
        if (!Array.isArray(articles) || articles.length === 0) {
            localStorage.setItem('articles', JSON.stringify(placeholderArticles));
            // Try to seed Supabase too
            if (supabase) {
                seedPlaceholderArticles();
            }
            return placeholderArticles;
        }
        
        return articles;
    } catch (e) {
        console.error('Error initializing articles:', e);
        localStorage.setItem('articles', JSON.stringify(placeholderArticles));
        return placeholderArticles;
    }
}

// Seed placeholder articles to Supabase - Force insert all placeholder articles
async function seedPlaceholderArticles() {
    if (!supabase) {
        console.warn('Cannot seed - Supabase client not available');
        return;
    }
    
    try {
        console.log('Checking for placeholder articles in database...');
        
        // Check if any of the placeholder articles already exist by title
        const placeholderTitles = placeholderArticles.map(a => a.title);
        const { data: existingArticles, error: checkError } = await supabase
            .from('articles')
            .select('id, title')
            .in('title', placeholderTitles);
        
        if (checkError) {
            console.error('Error checking for existing articles:', checkError);
            return;
        }
        
        const existingTitles = existingArticles ? existingArticles.map(a => a.title) : [];
        const articlesToInsert = placeholderArticles.filter(article => 
            !existingTitles.includes(article.title)
        );
        
        if (articlesToInsert.length === 0) {
            console.log('✅ All placeholder articles already exist in database');
            return;
        }
        
        console.log(`Inserting ${articlesToInsert.length} placeholder articles into Supabase...`);
        const articlesToInsertFormatted = articlesToInsert.map(article => ({
            title: article.title,
            description: article.description,
            image_url: article.image || null,
            content: article.content,
            author: article.author || 'Alli Nutrition Team'
        }));
        
        const { data: insertedData, error: insertError } = await supabase
            .from('articles')
            .insert(articlesToInsertFormatted)
            .select();
        
        if (insertError) {
            console.error('❌ Error seeding placeholder articles:', insertError);
            console.error('Error details:', JSON.stringify(insertError, null, 2));
        } else {
            console.log(`✅ Successfully inserted ${insertedData ? insertedData.length : 0} articles into Supabase`);
            if (insertedData && insertedData.length > 0) {
                console.log('Sample inserted article:', insertedData[0]);
            }
        }
    } catch (e) {
        console.error('❌ Exception seeding articles:', e);
        console.error('Exception stack:', e.stack);
    }
}

// Force seed all placeholder articles (call this manually if needed)
window.forceSeedPlaceholderArticles = async function() {
    if (!supabase) {
        console.error('Supabase not available');
        return;
    }
    
    console.log('Force seeding all placeholder articles...');
    const articlesToInsert = placeholderArticles.map(article => ({
        title: article.title,
        description: article.description,
        image_url: article.image || null,
        content: article.content,
        author: article.author || 'Alli Nutrition Team'
    }));
    
    const { data, error } = await supabase
        .from('articles')
        .insert(articlesToInsert)
        .select();
    
    if (error) {
        console.error('Error:', error);
    } else {
        console.log(`✅ Successfully inserted ${data ? data.length : 0} articles`);
    }
};

// Delete article from Supabase (with localStorage fallback) - make globally accessible
window.deleteArticle = async function(articleId) {
    console.log('=== deleteArticle called ===');
    console.log('Article ID:', articleId);
    console.log('Article ID type:', typeof articleId);
    console.log('Supabase client available:', !!supabase);
    
    // Try Supabase first
    if (supabase) {
        try {
            // Convert articleId to number if it's a string (Supabase uses numeric IDs)
            const numericId = typeof articleId === 'string' ? parseInt(articleId, 10) : articleId;
            
            if (isNaN(numericId)) {
                console.error('Invalid article ID - cannot convert to number:', articleId);
                return false;
            }
            
            console.log('Attempting to delete article with numeric ID:', numericId);
            
            // First, verify the article exists by querying it
            const { data: articleData, error: fetchError } = await supabase
                .from('articles')
                .select('id, title')
                .eq('id', numericId)
                .single();
            
            console.log('Article lookup result:', articleData);
            console.log('Article lookup error:', fetchError);
            
            if (fetchError || !articleData) {
                console.error('❌ Article not found in database. ID:', numericId);
                console.error('This might be a Row Level Security (RLS) issue or the ID doesn\'t exist.');
                // Still try to delete from localStorage
                deleteArticleFromLocalStorage(articleId);
                return false;
            }
            
            console.log(`Article found: "${articleData.title}" (ID: ${articleData.id})`);
            
            // Now attempt the delete
            const { data, error } = await supabase
                .from('articles')
                .delete()
                .eq('id', numericId)
                .select();
            
            console.log('Supabase delete response - data:', data);
            console.log('Supabase delete response - error:', error);
            
            if (error) {
                console.error('❌ Supabase delete error:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                console.error('Error details:', error.details);
                console.error('Error hint:', error.hint);
                
                // Check if it's an RLS policy issue
                if (error.code === '42501' || error.message.includes('permission') || error.message.includes('policy')) {
                    console.error('⚠️ This looks like a Row Level Security (RLS) policy issue.');
                    console.error('You may need to enable delete permissions in Supabase RLS policies.');
                }
                
                // Fallback to localStorage
                const localResult = deleteArticleFromLocalStorage(articleId);
                return localResult;
            }
            
            // Check if anything was actually deleted
            if (data && data.length > 0) {
                console.log(`✅ Successfully deleted article from Supabase. Deleted rows: ${data.length}`);
                console.log('Deleted article:', data[0]);
            } else {
                console.warn('⚠️ No rows deleted - delete query returned empty result');
                console.warn('This might be an RLS policy issue preventing deletion');
            }
            
            // Also delete from localStorage
            deleteArticleFromLocalStorage(articleId);
            
            return true;
        } catch (e) {
            console.error('❌ Exception deleting from Supabase:', e);
            console.error('Exception stack:', e.stack);
            // Fallback to localStorage
            return deleteArticleFromLocalStorage(articleId);
        }
    }
    
    console.warn('Supabase not available, using localStorage only');
    // Fallback to localStorage
    return deleteArticleFromLocalStorage(articleId);
}

// Delete article from localStorage (fallback)
function deleteArticleFromLocalStorage(articleId) {
    try {
        let articles = [];
        const stored = localStorage.getItem('articles');
        if (stored) {
            articles = JSON.parse(stored);
        }
        
        articles = articles.filter(a => a.id !== articleId && a.id !== articleId.toString());
        localStorage.setItem('articles', JSON.stringify(articles));
        console.log('Article deleted from localStorage');
        return true;
    } catch (e) {
        console.error('Error deleting from localStorage:', e);
        return false;
    }
}

// Update article in Supabase (with localStorage fallback) - make globally accessible
window.updateArticle = async function(articleId, updatedData) {
    // Try Supabase first
    if (supabase) {
        try {
            // Convert articleId to number if it's a string (Supabase uses numeric IDs)
            const numericId = typeof articleId === 'string' ? parseInt(articleId, 10) : articleId;
            
            const { data, error } = await supabase
                .from('articles')
                .update({
                    title: updatedData.title,
                    description: updatedData.description,
                    image_url: updatedData.image || null,
                    content: updatedData.content,
                    author: updatedData.author || 'Alli Nutrition Team'
                })
                .eq('id', numericId)
                .select()
                .single();
            
            if (error) {
                console.error('Supabase update error:', error);
                // Fallback to localStorage
                return updateArticleInLocalStorage(articleId, updatedData);
            }
            
            if (data) {
                // Convert and update localStorage
                const convertedArticle = {
                    id: data.id.toString(),
                    title: data.title,
                    description: data.description,
                    image: data.image_url,
                    content: data.content,
                    author: data.author,
                    createdAt: data.created_at
                };
                updateArticleInLocalStorage(convertedArticle.id, updatedData);
                return convertedArticle;
            }
        } catch (e) {
            console.error('Error updating in Supabase:', e);
            // Fallback to localStorage
            return updateArticleInLocalStorage(articleId, updatedData);
        }
    }
    
    // Fallback to localStorage
    return updateArticleInLocalStorage(articleId, updatedData);
}

// Update article in localStorage (fallback)
function updateArticleInLocalStorage(articleId, updatedData) {
    const articles = getArticlesFromLocalStorage();
    const articleIndex = articles.findIndex(a => a.id === articleId);
    
    if (articleIndex === -1) {
        console.error('Article not found for update');
        return null;
    }
    
    // Preserve createdAt
    articles[articleIndex] = {
        ...articles[articleIndex],
        ...updatedData,
        id: articleId
    };
    
    localStorage.setItem('articles', JSON.stringify(articles));
    return articles[articleIndex];
}

// Get all articles from Supabase (with localStorage fallback)
async function getArticles() {
    console.log('=== getArticles called ===');
    console.log('Supabase client available:', !!supabase);
    console.log('Supabase client:', supabase);
    
    // Try Supabase first
    if (supabase) {
        try {
            console.log('Fetching articles from Supabase...');
            console.log('Table: articles');
            console.log('Config URL:', window.SUPABASE_CONFIG?.url);
            
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });
            
            console.log('Supabase response - error:', error);
            console.log('Supabase response - data:', data);
            
            if (error) {
                console.error('❌ Supabase error:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                console.error('Error details:', error.details);
                console.error('Error hint:', error.hint);
                // Fallback to localStorage
                console.log('Falling back to localStorage due to error');
                return getArticlesFromLocalStorage();
            }
            
            if (data && data.length > 0) {
                console.log(`✅ Found ${data.length} articles in Supabase`);
                // Convert Supabase format to app format
                const converted = data.map(article => ({
                    id: article.id.toString(),
                    title: article.title,
                    description: article.description,
                    image: article.image_url,
                    content: article.content,
                    author: article.author,
                    createdAt: article.created_at
                }));
                console.log('Converted articles:', converted);
                return converted;
            } else {
                console.log('⚠️ No articles found in Supabase (empty result), falling back to localStorage');
                return getArticlesFromLocalStorage();
            }
        } catch (e) {
            console.error('❌ Exception fetching from Supabase:', e);
            console.error('Exception stack:', e.stack);
            // Fallback to localStorage
            return getArticlesFromLocalStorage();
        }
    }
    
    // Fallback to localStorage if Supabase not available
    console.warn('⚠️ Supabase not available, using localStorage');
    return getArticlesFromLocalStorage();
}

// Get articles from localStorage (fallback)
function getArticlesFromLocalStorage() {
    try {
        const articles = localStorage.getItem('articles');
        if (articles) {
            const parsed = JSON.parse(articles);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // Filter out placeholder articles by ID
                const userArticles = parsed.filter(a => !['1', '2', '3', '4', '5', '6'].includes(a.id));
                if (userArticles.length > 0) {
                    console.log(`Found ${userArticles.length} user articles in localStorage`);
                    return userArticles;
                }
            }
        }
    } catch (e) {
        console.error('Error getting articles from localStorage:', e);
    }
    
    // Only return placeholders if absolutely no articles exist
    console.log('No user articles found, returning placeholders');
    return placeholderArticles;
}

// Add new article to Supabase (with localStorage fallback) - make globally accessible
window.addArticle = async function(article) {
    console.log('addArticle called with:', article);
    console.log('Supabase client available:', !!supabase);
    
    // Try Supabase first
    if (supabase) {
        try {
            console.log('Attempting to insert article into Supabase...');
            const { data, error } = await supabase
                .from('articles')
                .insert([{
                    title: article.title,
                    description: article.description,
                    image_url: article.image || null,
                    content: article.content,
                    author: article.author || 'Alli Nutrition Team'
                }])
                .select()
                .single();
            
            if (error) {
                console.error('Supabase insert error:', error);
                // Fallback to localStorage
                const fallbackArticle = {
                    ...article,
                    id: Date.now().toString(),
                    createdAt: new Date().toISOString()
                };
                console.log('Falling back to localStorage, article:', fallbackArticle);
                return addArticleToLocalStorage(fallbackArticle);
            }
            
            if (data) {
                console.log('Article successfully inserted into Supabase:', data);
                // Convert Supabase format to app format
                const convertedArticle = {
                    id: data.id.toString(), // Convert numeric ID to string for consistency
                    title: data.title,
                    description: data.description,
                    image: data.image_url,
                    content: data.content,
                    author: data.author,
                    createdAt: data.created_at
                };
                
                // Also save to localStorage as backup
                addArticleToLocalStorage(convertedArticle);
                
                console.log('Returning converted article:', convertedArticle);
                return convertedArticle;
            }
        } catch (e) {
            console.error('Error adding to Supabase:', e);
            // Fallback to localStorage
            const fallbackArticle = {
                ...article,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            console.log('Exception caught, falling back to localStorage:', fallbackArticle);
            return addArticleToLocalStorage(fallbackArticle);
        }
    }
    
    // Fallback to localStorage if Supabase not available
    console.warn('Supabase not available, using localStorage only');
    const fallbackArticle = {
        ...article,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    console.log('Creating article in localStorage:', fallbackArticle);
    return addArticleToLocalStorage(fallbackArticle);
}

// Add article to localStorage (fallback)
function addArticleToLocalStorage(article) {
    let articles = [];
    try {
        const stored = localStorage.getItem('articles');
        if (stored) {
            articles = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error parsing localStorage articles:', e);
        articles = [];
    }
    
    // Filter out placeholder articles (they have numeric string IDs like '1', '2', etc.)
    articles = articles.filter(a => !['1', '2', '3', '4', '5', '6'].includes(a.id));
    
    articles.push(article);
    localStorage.setItem('articles', JSON.stringify(articles));
    console.log('Article saved to localStorage. Total articles:', articles.length);
    return article;
}

// Display articles (async to handle Supabase) - make globally accessible
window.displayArticles = async function displayArticles() {
    const grid = document.getElementById('resources-grid');
    if (!grid) {
        console.error('Resources grid element not found');
        return;
    }
    
    // Show skeleton loaders while fetching
    const skeletonCard = () => `
        <div class="skeleton-card">
            <div class="skeleton-image skeleton-shimmer"></div>
            <div class="skeleton-content">
                <div class="skeleton-line long skeleton-shimmer"></div>
                <div class="skeleton-line medium skeleton-shimmer"></div>
                <div class="skeleton-line short skeleton-shimmer" style="margin-top:16px"></div>
            </div>
        </div>
    `;
    grid.innerHTML = skeletonCard() + skeletonCard() + skeletonCard() + skeletonCard() + skeletonCard() + skeletonCard();
    
    let articles = await getArticles();
    
    // Only use placeholders if there are absolutely no articles
    // Never overwrite user-created articles
    if (!articles || articles.length === 0) {
        articles = placeholderArticles;
        localStorage.setItem('articles', JSON.stringify(placeholderArticles));
    }
    
    // Sort articles by createdAt timestamp (newest first)
    articles.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // Descending order (newest first)
    });
    
    // Check if admin is authenticated
    const isAdmin = sessionStorage.getItem('adminAuthenticated') === 'true';
    
    grid.innerHTML = articles.map(article => `
        <div class="resource-card" data-id="${article.id}">
            <div class="resource-bubble"></div>
            ${isAdmin ? `<button class="edit-article-btn" data-id="${article.id}" title="Edit Article"><i class="fas fa-edit"></i></button>` : ''}
            ${article.image ? `<img src="${article.image}" alt="${article.title}" class="resource-image">` : ''}
            <div class="resource-content">
                <h3 class="resource-card-title">${article.title}</h3>
                <p class="resource-card-description">${article.description}</p>
                <div class="resource-meta">
                    ${article.author ? `<span class="resource-author"><i class="fas fa-user"></i> ${article.author}</span>` : ''}
                    <span class="resource-date">${formatDate(article.createdAt)}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click handlers for cards (not on edit button)
    document.querySelectorAll('.resource-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking edit button
            if (e.target.closest('.edit-article-btn')) {
                return;
            }
            const articleId = this.getAttribute('data-id');
            window.location.href = `article.html?id=${articleId}`;
        });
    });
    
    // Add click handlers for edit buttons
    if (isAdmin) {
        document.querySelectorAll('.edit-article-btn').forEach(btn => {
            // Remove any existing handlers by cloning
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const articleId = this.getAttribute('data-id');
                console.log('Edit button clicked for article:', articleId);
                if (window.openEditModal && typeof window.openEditModal === 'function') {
                    window.openEditModal(articleId);
                } else if (typeof openEditModal === 'function') {
                    openEditModal(articleId);
                } else {
                    console.error('openEditModal function not found');
                    alert('Edit functionality not available. Please refresh the page.');
                }
            });
        });
    }
}

function setEditorContent(editorId, textareaId, content) {
    const editor = document.getElementById(editorId);
    const textarea = document.getElementById(textareaId);
    const value = content || '';
    if (editor) {
        if (/<[a-z][\s\S]*>/i.test(value.trim())) {
            editor.innerHTML = value;
        } else {
            editor.innerHTML = value.replace(/\n/g, '<br>');
        }
    }
    if (textarea) {
        textarea.value = value;
    }
}

// Open edit modal with article data (make globally accessible, async)
window.openEditModal = async function(articleId) {
    const articles = await getArticles();
    const article = articles.find(a => a.id === articleId || a.id === articleId.toString());
    
    if (!article) {
        alert('Article not found');
        return;
    }
    
    // Fill form with article data
    const titleInput = document.getElementById('edit-resource-title');
    const descInput = document.getElementById('edit-resource-description');
    const imageInput = document.getElementById('edit-resource-image');
    const contentInput = document.getElementById('edit-resource-content');
    const authorInput = document.getElementById('edit-resource-author');
    const idInput = document.getElementById('edit-resource-id');
    
    if (titleInput) titleInput.value = article.title || '';
    if (descInput) descInput.value = article.description || '';
    if (imageInput) imageInput.value = article.image || '';
    if (contentInput) contentInput.value = article.content || '';
    if (authorInput) authorInput.value = article.author || '';
    if (idInput) idInput.value = article.id;
    setEditorContent('edit-resource-content-editor', 'edit-resource-content', article.content || '');
    
    // Show edit modal
    const editModal = document.getElementById('edit-resource-modal');
    if (editModal) {
        editModal.style.display = 'flex';
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Initialize admin controls
function initializeAdminControls() {
    if (isAdminAuthenticated()) {
        document.getElementById('admin-controls').style.display = 'block';
    }
}

// Show admin password modal
function showAdminPasswordModal() {
    document.getElementById('admin-password-modal').style.display = 'flex';
    document.getElementById('admin-password').focus();
}

// Hide admin password modal
function hideAdminPasswordModal() {
    document.getElementById('admin-password-modal').style.display = 'none';
    document.getElementById('admin-password').value = '';
    document.getElementById('password-error').style.display = 'none';
}

// Verify admin password
function verifyAdminPassword(password) {
    return password === ADMIN_PASSWORD;
}

// Show add resource modal
function showAddResourceModal() {
    document.getElementById('add-resource-modal').style.display = 'flex';
}

// Hide add resource modal
function hideAddResourceModal() {
    document.getElementById('add-resource-modal').style.display = 'none';
    document.getElementById('add-resource-form').reset();
}

// Handle add resource form submission
// Removed handleAddResource - form submission is now handled by inline script in resources.html
// The inline script provides better functionality with dynamic DOM updates and async handling

// Use event delegation for edit buttons (works for dynamically created elements)
document.addEventListener('click', function(e) {
    if (e.target.closest('.edit-article-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const btn = e.target.closest('.edit-article-btn');
        const articleId = btn.getAttribute('data-id');
        console.log('Edit button clicked (via delegation) for article:', articleId);
        if (window.openEditModal && typeof window.openEditModal === 'function') {
            window.openEditModal(articleId);
        } else {
            console.error('openEditModal not found');
            alert('Edit functionality not available. Please refresh the page.');
        }
    }
});

// Direct Supabase test function - callable from console
window.testSupabaseDirect = async function() {
    console.log('=== DIRECT SUPABASE TEST ===');
    console.log('window.SUPABASE_CONFIG:', window.SUPABASE_CONFIG);
    console.log('window.supabase:', window.supabase);
    console.log('window.Supabase:', window.Supabase);
    
    // Try to create client directly
    if (!window.SUPABASE_CONFIG) {
        console.error('❌ SUPABASE_CONFIG not found');
        return;
    }
    
    let testClient = null;
    try {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            testClient = window.supabase.createClient(
                window.SUPABASE_CONFIG.url,
                window.SUPABASE_CONFIG.anonKey
            );
            console.log('✅ Created client using window.supabase');
        } else if (window.Supabase && typeof window.Supabase.createClient === 'function') {
            testClient = window.Supabase.createClient(
                window.SUPABASE_CONFIG.url,
                window.SUPABASE_CONFIG.anonKey
            );
            console.log('✅ Created client using window.Supabase');
        } else {
            console.error('❌ Cannot find Supabase library');
            console.log('Available window properties:', Object.keys(window).filter(k => k.toLowerCase().includes('supa')));
            return;
        }
        
        // Test query
        console.log('Testing query to articles table...');
        const { data, error } = await testClient
            .from('articles')
            .select('*')
            .limit(5);
        
        if (error) {
            console.error('❌ Query error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            console.error('Error details:', error.details);
            console.error('Error hint:', error.hint);
        } else {
            console.log(`✅ Query successful! Found ${data ? data.length : 0} articles`);
            console.log('Articles:', data);
        }
    } catch (e) {
        console.error('❌ Exception:', e);
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== RESOURCES PAGE DOMContentLoaded ===');
    console.log('window.SUPABASE_CONFIG:', window.SUPABASE_CONFIG);
    console.log('window.supabase:', window.supabase);
    
    // Ensure Supabase is initialized (in case scripts loaded in wrong order)
    if (!supabase) {
        console.log('Supabase not initialized, attempting initialization...');
        initializeSupabase();
        // Give it a moment, then try again
        setTimeout(() => {
            if (!supabase) {
                console.log('Retrying Supabase initialization...');
                initializeSupabase();
            }
            if (!supabase) {
                console.warn('⚠️ Supabase not initialized, will use localStorage only');
            }
        }, 1000);
    }
    
    // Update copyright year immediately
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('#current-year');
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
    
    // Initialize and display articles
    console.log('Starting article initialization...');
    initializeArticles().then((articles) => {
        console.log('Articles initialized, count:', articles ? articles.length : 0);
        console.log('Articles:', articles);
        // Always display articles
        return displayArticles();
    }).catch(error => {
        console.error('❌ Error initializing articles:', error);
        console.error('Error stack:', error.stack);
        // Still try to display articles even if initialization fails
        console.log('Attempting to display articles from localStorage...');
        displayArticles().catch(err => {
            console.error('❌ Error displaying articles:', err);
            console.error('Display error stack:', err.stack);
        });
    });
    
    initializeAdminControls();
    
    // Make title clickable for admin access - handle clicks on title and span
    const resourcesTitle = document.getElementById('resources-title');
    if (resourcesTitle) {
        // Handle clicks on the title or any child element
        resourcesTitle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!isAdminAuthenticated()) {
                showAdminPasswordModal();
            }
        });
        
        // Also make the span clickable
        const titleSpan = resourcesTitle.querySelector('.ali-gradient');
        if (titleSpan) {
            titleSpan.style.cursor = 'pointer';
        }
    }
    
    // Admin password modal handlers
    const addResourceBtn = document.getElementById('add-resource-btn');
    if (addResourceBtn) {
        addResourceBtn.addEventListener('click', function() {
            if (isAdminAuthenticated()) {
                showAddResourceModal();
            } else {
                showAdminPasswordModal();
            }
        });
    }
    
    // Password modal handlers
    document.getElementById('submit-password')?.addEventListener('click', function() {
        const password = document.getElementById('admin-password').value;
        if (verifyAdminPassword(password)) {
            setAdminAuthenticated(true);
            hideAdminPasswordModal();
            // Show the Add New Article button
            document.getElementById('admin-controls').style.display = 'block';
        } else {
            document.getElementById('password-error').textContent = 'Incorrect password. Please try again.';
            document.getElementById('password-error').style.display = 'block';
            document.getElementById('admin-password').value = '';
        }
    });
    
    document.getElementById('close-password-modal')?.addEventListener('click', hideAdminPasswordModal);
    document.getElementById('close-add-modal')?.addEventListener('click', hideAddResourceModal);
    document.getElementById('cancel-add-resource')?.addEventListener('click', hideAddResourceModal);
    
    // Note: Add resource form handler is now in inline script in resources.html
    // This provides better async handling and dynamic DOM updates
    
    // Close modals when clicking outside
    document.getElementById('admin-password-modal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            hideAdminPasswordModal();
        }
    });
    
    document.getElementById('add-resource-modal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            hideAddResourceModal();
        }
    });
    
    // Handle Enter key in password field
    document.getElementById('admin-password')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('submit-password').click();
        }
    });
});

