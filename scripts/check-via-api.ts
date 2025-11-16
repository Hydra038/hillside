import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkWithSupabaseAPI() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseKey === 'your_anon_key_here') {
      console.log('⚠️  Supabase API credentials not configured yet.\n');
      console.log('Please add these to your .env file:');
      console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/fyjmczdbllubrssixpnx');
      console.log('2. Click Settings > API');
      console.log('3. Copy the "Project URL" and "anon public" key');
      console.log('4. Add them to .env as NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY\n');
      return;
    }
    
    console.log('Connecting to Supabase via API...\n');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try to fetch from products table
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ Error accessing products table:', error.message);
      console.log('\nPossible issues:');
      console.log('- Table might not exist yet');
      console.log('- RLS (Row Level Security) policies might be blocking access');
      return;
    }
    
    console.log(`✅ Successfully connected to Supabase!`);
    console.log(`📋 Products table exists with ${count} rows\n`);
    
    // Try to get column information by fetching one row
    const { data: sampleData } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (sampleData && sampleData.length > 0) {
      console.log('Columns in products table:');
      Object.keys(sampleData[0]).forEach((col, index) => {
        console.log(`${index + 1}. ${col}`);
      });
      
      if ('is_featured' in sampleData[0]) {
        console.log('\n✅ is_featured column exists!');
      } else {
        console.log('\n⚠️  is_featured column NOT found.');
      }
    } else {
      console.log('No data in products table yet.');
      console.log('Run this SQL in Supabase SQL Editor to check schema:');
      console.log('SELECT column_name FROM information_schema.columns WHERE table_name = \'products\';');
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

checkWithSupabaseAPI();
