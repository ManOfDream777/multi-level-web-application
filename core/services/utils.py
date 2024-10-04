def validate_user_evaluation(serializer, evaluation, request, evaluation_by_user_model):
    try:
        user_evaluation = evaluation_by_user_model.objects.get(author=request.user, evaluation=evaluation)
        if user_evaluation.state == serializer.validated_data['state']:
            return False
    except evaluation_by_user_model.DoesNotExist:
        return True
    return True
