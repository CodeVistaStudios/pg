let selectedGateway = '';

function handleSupport() {
    document.getElementById('payment-options').classList.add('hidden');
    document.getElementById('faq-section').classList.add('hidden');
    document.getElementById('support-details').classList.remove('hidden');
}

function handleFAQ() {
    document.getElementById('payment-options').classList.add('hidden');
    document.getElementById('support-details').classList.add('hidden');
    document.getElementById('faq-section').classList.remove('hidden');
}

function handlePay() {
    document.getElementById('support-details').classList.add('hidden');
    document.getElementById('faq-section').classList.add('hidden');
    document.getElementById('payment-options').classList.remove('hidden');
}

function closeSupport() {
    document.getElementById('support-details').classList.add('hidden');
    document.getElementById('payment-options').classList.remove('hidden');
}

function closeFAQ() {
    document.getElementById('faq-section').classList.add('hidden');
    document.getElementById('payment-options').classList.remove('hidden');
}

function redirectToPayment(gateway) {
    selectedGateway = gateway;
    const iconMap = {
        'Bkash': 'images/bkash.png',
        'Upay': 'images/upay.png',
        'Nagad': 'images/nagad.png',
        'Binance': 'images/binance.png',
        'Bitget': 'images/bitget.png',
        'Bybit': 'images/bybit.png',
        'Tonkeeper': 'images/tonkeeper.png'
    };
    const iconUrl = iconMap[gateway];
    window.location.href = `payment.html?gateway=${gateway}&iconUrl=${encodeURIComponent(iconUrl)}`;
}

function copyNumber(number) {
    navigator.clipboard.writeText(number).then(() => {
        alert('Number copied to clipboard');
    });
}

function handleSubmit(event) {
    event.preventDefault();
    document.getElementById('progress-popup').classList.remove('hidden');
    const paidButton = document.getElementById('paid-button');
    paidButton.disabled = true;
    
    const form = document.getElementById('payment-form');
    const formData = new FormData(form);

    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            const formDataToSend = new FormData();
            formDataToSend.append('chat_id', config.channelId);
            formDataToSend.append('caption', `Payment Details:\nSender ID: ${formData.get('sender-id')}\nEmail: ${formData.get('email')}\nOrder Code: ${formData.get('order-code')}\nTransaction ID: ${formData.get('transaction-id')}\nPayment Gateway: ${formData.get('payment-gateway')}`);
            formDataToSend.append('photo', formData.get('payment-proof'));

            fetch(`https://api.telegram.org/bot${config.botToken}/sendPhoto`, {
                method: 'POST',
                body: formDataToSend
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('progress-popup').classList.add('hidden');
                paidButton.disabled = false;
                if (data.ok) {
                    document.getElementById('success-popup').classList.remove('hidden');
                    form.reset();
                } else {
                    alert('Failed to send payment details. Please try again.');
                }
            })
            .catch(error => {
                document.getElementById('progress-popup').classList.add('hidden');
                paidButton.disabled = false;
                console.error('Error:', error);
            });
        });
}

function closePopup() {
    document.getElementById('success-popup').classList.add('hidden');
}

// Set the payment gateway hidden field value based on URL parameter
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gateway = urlParams.get('gateway');
    const iconUrl = urlParams.get('iconUrl');
    if (gateway) {
        document.getElementById(gateway).classList.remove('hidden');
        document.getElementById('payment-gateway').value = gateway;
        if (iconUrl) {
            document.getElementById('payment-method-icon').src = decodeURIComponent(iconUrl);
        }
    }
});
