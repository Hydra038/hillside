require('dotenv').config();

async function testAuthAPI() {
    try {
        console.log('🧪 Testing authentication API...\n');

        const authData = {
            email: 'support@firewoodlogsfuel.com',
            password: 'Derq@038!'
        };

        console.log('Sending POST request to localhost:3001/api/auth/signin');
        console.log('Payload:', authData);

        const response = await fetch('http://localhost:3001/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authData)
        });

        console.log('\n📊 Response Status:', response.status);
        console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

        const responseText = await response.text();
        console.log('\n📝 Response Body:');
        console.log(responseText);

        if (response.ok) {
            console.log('\n✅ Authentication successful!');
            try {
                const jsonData = JSON.parse(responseText);
                console.log('User data:', jsonData.user);
            } catch (e) {
                console.log('Response is not JSON');
            }
        } else {
            console.log('\n❌ Authentication failed');
        }

    } catch (error) {
        console.error('Error testing auth API:', error.message);
        console.log('\n💡 Make sure the Next.js dev server is running on port 3001');
        console.log('Run: npm run dev');
    }
}

testAuthAPI();