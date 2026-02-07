
export const handler = async (event:any) => {
    const records = event?.Records ?? [];

    console.log(`Received ${records.length} SQS messages`)

    for (const record of records) {
        const body = JSON.parse(record.body);

        const dealId = body.dealId;

        console.log(`Processing deal check job for dealId = ${dealId} `)
    }

    return {ok: true}
}