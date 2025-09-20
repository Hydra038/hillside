// Test script to verify contact form functionality
require('dotenv').config();

async function testContactForm() {
  try {
    console.log('🧪 Testing Contact Form Functionality\n');

    const testMessage = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Contact Message',
      message: 'This is a test message to verify the contact form is working properly.'
    };

    console.log('📝 Sending test contact message...');
    console.log('Data:', testMessage);

    const response = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testMessage)
    });

    console.log(`\n📡 Response Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS: Contact message saved successfully!');
      console.log('Response:', data);
      console.log(`\n🎯 Message ID: ${data.id}`);
      
      console.log('\n📋 Manual Test Instructions:');
      console.log('1. Go to http://localhost:3001/contact');
      console.log('2. Fill out the contact form');
      console.log('3. Submit the form');
      console.log('4. Check for success message');
      console.log('5. Go to admin dashboard to verify message was saved');
      
    } else {
      const errorData = await response.json();
      console.log('❌ FAILED: Contact form API returned error');
      console.log('Error:', errorData);
    }

  } catch (error) {
    console.error('❌ FAILED: Error testing contact form:', error);
    console.log('\n📝 Manual Test Instructions:');
    console.log('1. Make sure development server is running (npm run dev)');
    console.log('2. Go to http://localhost:3001/contact');
    console.log('3. Fill out and submit the contact form');
    console.log('4. Check if you get "Message Sent!" confirmation');
  }
}

console.log('🔧 Contact Form Test');
console.log('===================\n');
testContactForm();