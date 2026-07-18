def test_get_reports(client):
    response = client.get("/api/v1/counterfeit")

    assert response.status_code == 200

    body = response.json()

    assert body["success"] is True
