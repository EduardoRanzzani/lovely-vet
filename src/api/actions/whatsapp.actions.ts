'use server';

export const sendWhatsappMessage = async (payload: WhatsappPayload) => {
	console.log('Enviando mensagem para WhatsApp:', payload);
	const response = await fetch(
		`http://72.61.218.192:8080/message/sendText/LovelyVet`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				apikey: process.env.EVOLUTION_API_KEY || '',
			},
			body: JSON.stringify(payload),
		},
	);

	console.log('Resposta da API:', { response });
	return response.json();
};
